import readline from 'readline'
import {Node} from './node.mjs'

const getInput = () => {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    return new Promise((resolve) =>
        rl.on('line', (line) => {
            rl.close();
            resolve(line.split(' '));
        }))
}

export const displayBoard = (state) => {
    let index = 0
    for (let i = 0; i < 3; i++) {
        console.log("-------------")
        console.log(`| ${state[index]} | ${state[index + 1]} | ${state[index + 2]} |`)
        index += 3
    }
    console.log("-------------")
}

const moveUp = (state) => {
    let newState = state.slice()
    const index = newState.indexOf(0)
    if (![0, 1, 2].includes(index)) {
        // swap values
        let temp = newState[index - 3]
        newState[index - 3] = newState[index]
        newState[index] = temp
        return newState
    } else {
        // can't move
        return null
    }
}

const moveDown = (state) => {
    let newState = state.slice()
    const index = newState.indexOf(0)
    if (![6, 7, 8].includes(index)) {
        // swap values
        let temp = newState[index + 3]
        newState[index + 3] = newState[index]
        newState[index] = temp
        return newState
    } else {
        // can't move
        return null
    }

}

const moveLeft = (state) => {
    let newState = state.slice()
    const index = newState.indexOf(0)
    if (![0, 3, 6].includes(index)) {
        // swap values
        let temp = newState[index - 1]
        newState[index - 1] = newState[index]
        newState[index] = temp
        return newState
    } else {
        // can't move
        return null
    }
}

const moveRight = (state) => {
    let newState = state.slice()
    const index = newState.indexOf(0)
    if (![2, 5, 8].includes(index)) {
        // swap values
        let temp = newState[index + 1]
        newState[index + 1] = newState[index]
        newState[index] = temp
        return newState
    } else {
        // can't move
        return null
    }

}

const expandNode = (node) => {
    // return list of expanded nodes
    let expandedNodes = []
    if (moveUp(node.state) !== null) {
        expandedNodes.push(new Node(moveUp(node.state), node, 'up', node.depth + 1))
    }
    if (moveDown(node.state) !== null) {
        expandedNodes.push(new Node(moveDown(node.state), node, 'down', node.depth + 1))
    }
    if (moveLeft(node.state) !== null) {
        expandedNodes.push(new Node(moveLeft(node.state), node, 'left', node.depth + 1))
    }
    if (moveRight(node.state) !== null) {
        expandedNodes.push(new Node(moveRight(node.state), node, 'right', node.depth + 1))
    }
    return expandedNodes
}


const bfs = (start, goal) => {
    const nodes = [] //queue
    nodes.push(new Node(start, null, null, 0))
    let count = 0
    const explored = []
    while (nodes.length > 0) {
        const node = nodes.pop()
        count++
        console.log(`Trying state ${node.state} and move: ${node.operator}`)
        explored.push(node.getState())
        if (JSON.stringify(node.state) === JSON.stringify(goal)) {
            console.log(`done !\nThe number of nodes visited : ${count}`)
            console.log('States of moves are as follows:')
            return node.pathFromStart()
        } else {
            // Expand the node and add all the expansions to the end of the queue
            const expandedNodes = expandNode(node)
            for (const item of expandedNodes) {
                let state = item.getState()
                // console.log(state, 'line 124')
                // console.log(explored, 'line 125')
                let isExplored = false
                for (const exploreState of explored) {
                    if (JSON.stringify(exploreState) === JSON.stringify(state)){
                        isExplored = true
                    }
                }
                if (!isExplored) {
                    nodes.push(item)
                }
            }
        }
    }

}


const ids = (start, goal) => {

}

const forward_backward_search = (start, goal) => {

}

const main = async () => {
    console.info("enter start state in one line with split : (for blank Enter 0)")
    let startState = await getInput()
    // string to number
    startState = startState.map((element) => {
        return +element
    })
    console.info("enter goal state in one line with split : (for blank Enter 0)")
    let goalState = await getInput()
    // string to number
    goalState = goalState.map((element) => {
        return +element
    })
    console.log('start state is : ');
    displayBoard(startState)
    console.log('goal state is : ');
    displayBoard(goalState)
    const startTime = new Date()
    /**
     * uncomment this functions to use bfs,ids, forward_backward_search
     * **/
    let result
    result = bfs(startState, goalState) // problem 1
    // result = ids(startState, goalState) // problem 2
    // result = forward_backward_search(startState, goalState) //problem 3
    if (result === undefined){
        console.log('no solution found')
    } else if (JSON.stringify(result) === JSON.stringify([null])){
        console.log('start node was the goal')
    } else {
        console.log(result)
        console.log(`${result.length} moves`)
    }
    const endTime = new Date()
    console.log(`Total time : ${(endTime - startTime) * 0.001} seconds`);
}

main().then()
