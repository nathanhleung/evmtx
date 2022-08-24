from eth_utils.curried import apply_formatters_to_dict
from web3._utils.method_formatters import to_hex_if_integer

tx_formatter = apply_formatters_to_dict(
    {
        "value": to_hex_if_integer,
        "gasPrice": to_hex_if_integer,
        "maxPriorityFeePerGas": to_hex_if_integer,
        "maxFeePerGas" : to_hex_if_integer,
        "gasLimit": to_hex_if_integer,
    }
)
