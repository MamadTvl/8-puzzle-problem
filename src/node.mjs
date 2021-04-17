import {displayBoard} from "./index.mjs";

export class Node {
    constructor(state, parent, operator, depth) {
        this.state = state;
        this.parent = parent;
        this.operator = operator;
        this.depth = depth;
    }

    getState = () => {
        return this.state
    }

    getMoves = () => {
        return this.operator
    }

    getDepth = () => {
        return this.depth
    }

    pathFromStart = () => {
        let stateList = []
        let moveList = []
        let currentNode = this
        while (currentNode.getMoves()) {
            stateList.push(currentNode.getState())
            moveList.push(currentNode.getMoves())
            currentNode = currentNode.parent
        }
        stateList.reverse()
        moveList.reverse()
        for (const item of stateList) {
            displayBoard(item)
        }
        return moveList
    }
     bs_pathFromStart = (backward) => {
         let stateList = []
         let moveList = []
         let forward = this
         while (forward.getMoves()) {
             stateList.push(forward.getState())
             moveList.push(forward.getMoves())
             forward = forward.parent
         }
         while (backward.getMoves()) {
             stateList.push(backward.getState().reverse())
             moveList.push(backward.getMoves().reverse())
             backward = backward.parent
         }
         stateList.reverse()
         moveList.reverse()
         for (const item of stateList) {
             displayBoard(item)
         }
         return moveList
     }
}
