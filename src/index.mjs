import readline from 'readline'
import {Node} from './node.mjs'
import PriorityQueue from 'js-priority-queue'

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

const moveUp = (state, index) => {
    let newState = state.slice()
    // swap values
    let temp = newState[index - 3]
    newState[index - 3] = newState[index]
    newState[index] = temp
    return newState
}

const moveDown = (state, index) => {
    let newState = state.slice()
    // swap values
    let temp = newState[index + 3]
    newState[index + 3] = newState[index]
    newState[index] = temp
    return newState

}

const moveLeft = (state, index) => {
    let newState = state.slice()
    // swap values
    let temp = newState[index - 1]
    newState[index - 1] = newState[index]
    newState[index] = temp
    return newState
}

const moveRight = (state, index) => {
    let newState = state.slice()
    // swap values
    let temp = newState[index + 1]
    newState[index + 1] = newState[index]
    newState[index] = temp
    return newState
}

const expandNode = (node) => {
    // return list of expanded nodes
    let expandedNodes = []
    // console.log(node.getState())
    const index = node.getState().indexOf(0)
    if (![0, 1, 2].includes(index)) {
        expandedNodes.push(new Node(moveUp(node.state, index), node, 'up', node.depth + 1))
    }
    if (![6, 7, 8].includes(index)) {
        expandedNodes.push(new Node(moveDown(node.state, index), node, 'down', node.depth + 1))
    }
    if (![0, 3, 6].includes(index)) {
        expandedNodes.push(new Node(moveLeft(node.state, index), node, 'left', node.depth + 1))
    }
    if (![2, 5, 8].includes(index)) {
        expandedNodes.push(new Node(moveRight(node.state, index), node, 'right', node.depth + 1))
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
                let isExplored = false
                for (const exploreState of explored) {
                    if (JSON.stringify(exploreState) === JSON.stringify(state)) {
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

const dls = (start, goal, depth = 20) => {
    const depthLimit = depth
    console.log('depth limit: ', depthLimit)
    let nodes = []
    nodes.push(new Node(start, null, null, 0))
    let count = 0
    const explored = []
    while (nodes.length > 0) {
        const node = nodes.pop()
        count++
        console.log(`${count}: Trying state ${node.getState()} and move: ${node.operator}`)
        explored.push(node.getState())
        if (JSON.stringify(node.state) === JSON.stringify(goal)) {
            console.log(`done !\nThe number of nodes visited : ${count}`)
            console.log('States of moves are as follows:')
            return node.pathFromStart()
        }
        if (node.depth < depthLimit) {
            const expandedNodes = expandNode(node)
            for (const item of expandedNodes) {
                let state = item.getState()
                let isExplored = false
                for (const exploreState of explored) {
                    if (JSON.stringify(exploreState) === JSON.stringify(state)) {
                        isExplored = true
                    }
                }
                if (!isExplored) {
                    nodes = [item, ...nodes]
                }
            }
        }
    }

}

const ids = (start, goal, depth = 50) => {
    for (let i = 0; i < depth; i++) {
        const result = dls(start, goal, i)
        if (result !== undefined) {
            return result
        }
    }
}

const bidirectionalSearch = (start, goal) => {
    const forwardVisited = new Map() // set (key: state,value: node)
    const backwardVisited = new Map() // set (key: state,value: node)
    const forwardSpace = new PriorityQueue({
        comparator: function(a, b) {
            return a.getDepth() - b.getDepth()
        }
    })
    const backwardSpace = new PriorityQueue({
        comparator: function(a, b) {
            return a.getDepth() - b.getDepth()
        }
    })
    forwardSpace.queue(new Node(start, null, null, 0)) //start from forward
    backwardSpace.queue(new Node(goal, null, null, 0)) //start from backward
    let count = 0
    while (forwardSpace.length > 0 && backwardSpace.length > 0) {
        const forwardNode = forwardSpace.dequeue()
        const backwardNode = backwardSpace.dequeue()

        console.log(`${count}: Trying forward state ${forwardNode.getState()} and move: ${forwardNode.operator}`)
        console.log(`${count}: Trying backward state ${backwardNode.getState()} and move: ${backwardNode.operator}`)

        if (backwardVisited.has(JSON.stringify(forwardNode.state))) { // save forward state in backward HashMap ? Y: we are in middle
            return forwardNode.bs_pathFromStart(backwardVisited.get(JSON.stringify(forwardNode.state)))
        }

        if (!forwardVisited.has(JSON.stringify(forwardNode.state))) { // we have not this state ?
            forwardVisited.set(JSON.stringify(forwardNode.state), forwardNode)
            const expandedNodes = expandNode(forwardNode)
            for (const item of expandedNodes) {
                forwardSpace.queue(item)
            }
        }

        if (!backwardVisited.has(JSON.stringify(backwardNode.state))) { // we have not this state ?
            backwardVisited.set(JSON.stringify(backwardNode.state), backwardNode)
            const expandedNodes = expandNode(backwardNode)
            for (const item of expandedNodes) {
                backwardSpace.queue(item)
            }
        }

        count++
    }
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
     * uncomment this functions to use bfs, ids ,dls, bidirectionalSearch
     * **/
    let result
    // result = bfs(startState, goalState) // problem 1
    // result = dls(startState, goalState)
    // result = ids(startState, goalState) // problem 2
    result = bidirectionalSearch(startState, goalState) //problem 3

    if (result === undefined) {
        console.log('no solution found')
    } else if (result.length === 0) {
        console.log('start node was the goal')
    } else {
        let moves = ''
        for (const move of result) {
            moves += move
            moves += ', '
        }
        console.log(moves)
        console.log(`${result.length} moves`)
    }
    const endTime = new Date()
    console.log(`Total time : ${(endTime - startTime) * 0.001} seconds`);
}

main().then()
