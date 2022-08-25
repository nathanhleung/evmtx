from eth_utils.curried import apply_formatters_to_dict
from web3._utils.method_formatters import to_hex_if_integer
from web3 import Web3
from hexbytes import HexBytes
from web3._utils.abi import map_abi_data
from web3._utils.normalizers import BASE_RETURN_NORMALIZERS
from typing import List, Optional, Tuple, Any, cast, Union
import requests
from attrs import define
from web3._utils.abi import (
    exclude_indexed_event_inputs,
    get_indexed_event_inputs,
    map_abi_data,
    normalize_event_input_types,
)
from web3._utils.encoding import (
    hexstr_if_str,
)
from web3.exceptions import (
    InvalidEventABI,
    LogTopicError,
    MismatchedABI,
)

import itertools
from web3.datastructures import (
    AttributeDict,
)

from web3.types import (
    ABIEvent,
    EventData,
)
from web3._utils.events import get_event_abi_types_for_decoding, get_event_data
FOUR_BYTES = "https://www.4byte.directory/api/v1/signatures/?hex_signature="


@define
class ABIData:
    name: str
    types: List[str]


tx_formatter = apply_formatters_to_dict(
    {
        "value": to_hex_if_integer,
        "gasPrice": to_hex_if_integer,
        "maxPriorityFeePerGas": to_hex_if_integer,
        "maxFeePerGas": to_hex_if_integer,
        "gasLimit": to_hex_if_integer,
    }
)

def construct_basic_type(type_str: str, types: Union[Tuple, List]): 
    #print(type_str)
    if type_str != "":
        types.append(type_str)


def construct_type(type_str: str, types: Union[Tuple, List]):
    #print(f"compact type : {type_str}")
    index = 0
    while index < len(type_str):
        if type_str[index] == '(':
            cnt = 1
            for i in range(index+1, len(type_str)):
                char = type_str[i]
                if char == '(':
                    cnt += 1
                elif char == ')':
                    cnt -= 1
                    if cnt == 0:
                        construct_type(type_str[index+1: i], types)
                        index = i
        else:
            for i in range(index+1, len(type_str)):
                char = type_str[i]
                if char == ',':
                    if type_str[index] == ',':
                        construct_basic_type(type_str[index+1: i], types)
                    else:
                        construct_basic_type(type_str[index: i], types)
                    index = i
                elif ',' not in type_str[index:]:
                    construct_basic_type(type_str[index: ], types)
                    index = len(type_str)
        index += 1      
    #print("finish decoding")



def get_abi_types(calldata: HexBytes) -> Optional[ABIData]:
    func_sig = calldata[:4]
    url = f"{FOUR_BYTES}{func_sig.hex()}"
    response = requests.get(url)
    return_abi = None
    if response.status_code == 200:
        results = response.json()["results"]
        min_id = 2**64 - 1
        for result in results:
            result["id"] = int(result["id"])
            text_signature: str = result["text_signature"]
            name = text_signature[:text_signature.find("(")]
            type_str = text_signature[text_signature.find("(")+1: -1]
            types = []
            construct_type(type_str, types)
            #print(types)
            if result["id"] < min_id:
                return_abi = ABIData(name, types)
                min_id = result["id"]
    return return_abi


def decode_function_data(calldata: HexBytes) -> Tuple[str, List[Any]]:
    # add a dummy provider
    w3 = Web3(Web3.HTTPProvider("http://localhost:0000"))
    abidata = get_abi_types(calldata)
    if abidata is not None:
        decoded = w3.codec.decode_abi(abidata.types, calldata[4:])
        return (abidata.name, map_abi_data(BASE_RETURN_NORMALIZERS, abidata.types, decoded))
    else:
        raise ValueError("could not find a decoder")
