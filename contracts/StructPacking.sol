//SPDX-License-Identifier: GPL-3.0

pragma solidity 0.8.19;

contract StructPacking {

    struct Entity {
        uint160 n1;
        uint32 n2;
        bool b1;
    }

    mapping(uint256 => uint256) public entities;

    function pack(uint256 _n1, uint256 _n2, bool _b1, uint256 _i) external {
        uint256 packed = _n1;
        packed |= _n2 << 160;
        if (_b1) packed |= (1 << 192);
        entities[_i] = packed;
    }

    function unpack(uint256 _i) external view returns (
        uint256 _n1,
        uint256 _n2,
        bool _b1
    ) {
        uint256 packed = entities[_i];
        _n1 = uint256(uint160(packed));
        _n2 = uint256(uint32(packed >> 160));
        _b1 = packed >> 192 & 1 == 1;
    }
}