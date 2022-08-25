from eth_utils.curried import apply_formatters_to_dict
from web3._utils.method_formatters import to_hex_if_integer
from web3 import Web3
from hexbytes import HexBytes
from web3._utils.abi import map_abi_data
from web3._utils.normalizers import BASE_RETURN_NORMALIZERS
from typing import List, Optional, Tuple, Any, cast
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


def get_abi_types(calldata: HexBytes) -> Optional[ABIData]:
    func_sig = calldata[:4]
    url = f"{FOUR_BYTES}{func_sig.hex()}"
    response = requests.get(url)
    return_abi = None
    if response.status_code == 200:
        results = response.json()["results"]
        min_id = 2**64 -1 
        for result in results:
            text_signature: str = result["text_signature"]
            name = text_signature[:text_signature.find("(")]
            type_str = text_signature[text_signature.find("(")+1: -1]
            types = [t for t in type_str.split(',')]
            if result["id"] < min_id:
                return_abi = ABIData(name, types)
                min_id = result["id"]
    return return_abi


def decode_function_data(calldata: HexBytes) -> Tuple[str, List[Any]]:
    # add a dummy provider
    w3 = Web3(Web3.HTTPProvider("http://localhost:0000"))
    abidata = get_abi_types(calldata)
    if abidata is None:
        decoded = w3.codec.decode_abi(abidata.types, calldata[4:])
        return (abidata.name, map_abi_data(BASE_RETURN_NORMALIZERS, abidata.types, decoded))
    else:
        raise ValueError("could not find a decoder")
"""
def decode_event_data(event_abi: ABIEvent, log_entry: LogReceipt) -> EventData:
    w3 = Web3(Web3.HTTPProvider("http://localhost:0000"))
    if event_abi["anonymous"]:
        log_topics = log_entry["topics"]
    elif not log_entry["topics"]:
        raise MismatchedABI("Expected non-anonymous event to have 1 or more topics")
    # type ignored b/c event_abi_to_log_topic(event_abi: Dict[str, Any])
    elif event_abi_to_log_topic(event_abi) != log_entry["topics"][0]:  # type: ignore
        raise MismatchedABI("The event signature did not match the provided ABI")
    else:
        log_topics = log_entry["topics"][1:]

    log_topics_abi = get_indexed_event_inputs(event_abi)
    log_topic_normalized_inputs = normalize_event_input_types(log_topics_abi)
    log_topic_types = get_event_abi_types_for_decoding(log_topic_normalized_inputs)
    log_topic_names = get_abi_input_names(ABIEvent({"inputs": log_topics_abi}))

    if len(log_topics) != len(log_topic_types):
        raise LogTopicError(
            f"Expected {len(log_topic_types)} log topics.  Got {len(log_topics)}"
        )

    log_data = hexstr_if_str(to_bytes, log_entry["data"])
    log_data_abi = exclude_indexed_event_inputs(event_abi)
    log_data_normalized_inputs = normalize_event_input_types(log_data_abi)
    log_data_types = get_event_abi_types_for_decoding(log_data_normalized_inputs)
    log_data_names = get_abi_input_names(ABIEvent({"inputs": log_data_abi}))

    # sanity check that there are not name intersections between the topic
    # names and the data argument names.
    duplicate_names = set(log_topic_names).intersection(log_data_names)
    if duplicate_names:
        raise InvalidEventABI(
            "The following argument names are duplicated "
            f"between event inputs: '{', '.join(duplicate_names)}'"
        )

    decoded_log_data = abi_codec.decode_abi(log_data_types, log_data)
    normalized_log_data = map_abi_data(
        BASE_RETURN_NORMALIZERS, log_data_types, decoded_log_data
    )

    decoded_topic_data = [
        abi_codec.decode_single(topic_type, topic_data)
        for topic_type, topic_data in zip(log_topic_types, log_topics)
    ]
    normalized_topic_data = map_abi_data(
        BASE_RETURN_NORMALIZERS, log_topic_types, decoded_topic_data
    )

    event_args = dict(
        itertools.chain(
            zip(log_topic_names, normalized_topic_data),
            zip(log_data_names, normalized_log_data),
        )
    )

    event_data = {
        "args": event_args,
        "event": event_abi["name"],
        "logIndex": log_entry["logIndex"],
        "transactionIndex": log_entry["transactionIndex"],
        "transactionHash": log_entry["transactionHash"],
        "address": log_entry["address"],
        "blockHash": log_entry["blockHash"],
        "blockNumber": log_entry["blockNumber"],
    }

    return cast(EventData, AttributeDict.recursive(event_data))
"""