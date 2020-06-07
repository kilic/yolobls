pragma solidity >=0.4.22 <0.7.0;


contract Marius {
    
    event Bytes(bytes);
    event Uint(uint256);
    
    function callPrec(uint256 addr, bytes memory input) public {
        uint256 a;
        uint256 b;
        uint256 c;
        uint256 d;
        uint256 len = input.length;
        uint256 outLen;
        if (addr == 0x0a || addr == 0x0b || addr == 0x0c || addr == 0x11) {
            outLen = 128;
        } else if (addr == 0x0d || addr == 0x0e || addr == 0x0f || addr == 0x12) {
            outLen = 256;
        } else if (addr == 0x10) {
            outLen = 32;
        } else {
            require(false, "Invalid precompile");
        }
        assembly {
            let res := mload(0x40)
            // call precompile
            if iszero(staticcall(gas(), addr, input, len, res, outLen)) {
                revert(0, 0)
            }
            a := mload(res)
            b := mload(add(res,32))
            c := mload(add(res,64))
            d := mload(add(res,96))
        }
        emit Uint(a);
        emit Uint(b);
        emit Uint(c);
        emit Uint(d);
    }
}
//"0x11","0x000000000000000000000000000000000dbb997ef4970a472bfcf03e959acb90bb13671a3d27c91698975a407856505e93837f46afc965363f21c35a3d194ec0"
// 0x51eF031Ba1B2128971bd67A3ba5dda9BfF8706c8
//"0x0a", "0x0000000000000000000000000000000008797f704442e133d3b77a5f0020aa304d36ce326ea75ca47e041e4d8a721754e0579ce82b96a69142cb7185998d18ce00000000000000000000000000000000144f438d86d1d808d528ea60c5d343b427124af6e43d4d9652368ddc508daab32fd9c9425cba44fba72e3449e366b1700000000000000000000000000000000002c9e50f37ff0db2676637be8a6275fce7948ae700df1e9e6a0861a8af942b6032cca2c3be8b8d95d4b4b36171b4b0d400000000000000000000000000000000050f1a9b2416bbda35bac9c8fdd4a91c12e7ee8e035973f79bd35e418fd88fa603761e2b36736c13f1d7a582984bd15e"