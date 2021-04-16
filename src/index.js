const readline = require('readline');

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

const dispalyBoard = (state) => {
    let index = 0
    for (let i = 0; i < 3; i++) {
        console.log("-------------")
        console.log(`| ${state[index]} | ${state[index + 1]} | ${state[index + 2]} |`)
        index += 3
    }
    console.log("-------------")
}
const moveUp = (state) => {
    let newState = state
    const index = newState.indexOf(0)
    if (index !== [0, 1, 2]){
        // swap values
        let temp = newState[index - 3]
        newState[index - 3] = newState[index]
        newState[index] = temp
        return newState
    }else{
        // can't move
        return null
    }
}
const moveDown = (state) => {
    let newState = state
    const index = newState.indexOf(0)
    if (index !== [6, 7, 8]){
        // swap values
        let temp = newState[index + 3]
        newState[index + 3] = newState[index]
        newState[index] = temp
        return newState
    }else{
        // can't move
        return null
    }

}
const moveLeft = (state) => {
    let newState = state
    const index = newState.indexOf(0)
    if (index !== [0, 3, 6]){
        // swap values
        let temp = newState[index - 1]
        newState[index - 1] = newState[index]
        newState[index] = temp
        return newState
    }else{
        // can't move
        return null
    }
}
const moveRight = (state) => {
    let newState = state
    const index = newState.indexOf(0)
    if (index !== [2, 5, 8]){
        // swap values
        let temp = newState[index + 1]
        newState[index + 1] = newState[index]
        newState[index] = temp
        return newState
    }else{
        // can't move
        return null
    }

}

const bfs = (start, goal) => {
    moveUp(start)
}

const ids = (start, goal) => {

}

const forward_backward_search = (start, goal) => {

}

const handleInput = async() => {
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
    dispalyBoard(startState)
    console.log('goal state is : ');
    dispalyBoard(goalState)
    /** uncomment this functions to use bfs,ids, forward_backward_search **/
    const startTime = new Date()
    bfs(startState, goalState) // problem 1
    // ids(startState, goalState) // problem 2
    // forward_backward_search(startState, goalState) //problem 3
    const endTime = new Date()
    console.log(`Total time : ${(endTime - startTime) * 0.001} seconds`);
}

handleInput().then()
