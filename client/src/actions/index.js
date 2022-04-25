import axios from 'axios';


export const getPlayers =(playerArray) => ({type: 'LOADING_PLAYERS', payload: playerArray})

const getQuizInfo = (quiz) => ({ type: 'LOADING_QUIZ', payload: quiz });

const loading = () => ({type: 'LOADING_QUIZ'})

export const updateScore = (playerName, score) => ({type: 'SET_SCORE', payload: {playerName, score}})

export const emptyQuiz = () => ({type: 'EMPTY_QUIZ'})

export const getQuiz = (questionNumber, difficulty, type) => {
    console.log('all variables going to getQuiz', questionNumber, difficulty, type)
    return async dispatch => {
        try{
            dispatch(loading)
            if(questionNumber && difficulty && type){
                const { data }  = await axios.get(`https://opentdb.com/api.php?amount=${questionNumber}&category=21&difficulty=${difficulty}&type=${type}`);
                console.log("response of fetch here", data)
                if(data.response_code === 0){
                    await dispatch(getQuizInfo(data.results));
                }
                else{
                    throw Error('not a valid input!')
                }
            }
            else if(!difficulty && type){
                const { data }  = await axios.get(`https://opentdb.com/api.php?amount=${questionNumber}&difficulty=${difficulty}&type=${type}`);
                console.log("response of fetch here", data)
                if(data.response_code === 0){
                    await dispatch(getQuizInfo(data.results));
                }
                else{
                    throw Error('not a valid input!')
                }
            }
            else if(difficulty && !type){
                const { data }  = await axios.get(`https://opentdb.com/api.php?amount=${questionNumber}&difficulty=${difficulty}&category=21`);
                console.log("response of fetch here", data)
                if(data.response_code === 0){
                    await dispatch(getQuizInfo(data.results));
                }
                else{
                    throw Error('not a valid input!')
                }
            }
            else if(!difficulty && !type){
                const { data }  = await axios.get(`https://opentdb.com/api.php?amount=${questionNumber}&category=21`);
                console.log("response of fetch here", data)
                if(data.response_code === 0){
                    await dispatch(getQuizInfo(data.results));
                }
                else{
                    throw Error('not a valid input!')
                }
            }
          
            else{
                const { data }  = await axios.get(`https://opentdb.com/api.php?amount=${questionNumber}`);
                console.log("response of fetch here", data)
                if(data.response_code === 0){
                    await dispatch(getQuizInfo(data.results));
                }
                else{
                    throw Error('not a valid input!')
                }
            }



        }
        catch(err){
            console.log(err)
            dispatch({ type: 'SET_ERROR', payload: err.message })

        }
    }
}
