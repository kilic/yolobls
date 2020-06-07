pragma solidity 0.6.7;


contract BLS {
    event Result(bytes output);

    function test(
        address addr,
        bytes memory input,
        uint256 outLen
    ) public returns (bytes memory) {
        uint256 inLen = input.length;
        bytes memory output = new bytes(outLen);
        assembly {
            if iszero(
                staticcall(
                    gas(),
                    addr,
                    add(input, 0x20),
                    inLen,
                    add(output, 0x20),
                    outLen
                )
            ) {
                revert(0, 0)
            }
        }
        emit Result(output);
        return output;
    }
}
