// SPDX-License-Identifier: MIT

pragma solidity >=0.7.0 <0.9.0;

interface ITaskInterface {
    enum State {
        BUILDER_ACCEPTED,
        COMPLETE,
        CANCELLED
    }

    struct TaskInfo {
        string name;
        State currentState;
        address projectAddress; // deployed project address
        address founderAddress; // founder wallet address
        address builderAddress; // builder wallet address
        uint256 usdc_amount;
        uint256 fndr_amount;
        uint256 xp;
        bool isBuilderAgreed;
    }

    function getTaskById(uint256 _tokenId)
        external
        view
        returns (TaskInfo memory);

    function checkTaskId(uint256 _taskId) external view returns (bool);
}
