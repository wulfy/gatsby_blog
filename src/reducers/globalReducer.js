const defaultState = {scrollValue:0,scrollingDown:false};
export default function scrollReducer(state = defaultState, action) {
	switch(action.type)
	{
		case `SCROLL`:
			const scrollingDown = state.scrollValue < action.value;
			//console.log("SCROLL!!!")
			return {...state, scrollValue:action.value, scrollingDown};
			break;
		default :
			return state;
	}
};