
const defaultState = {count:0};
export default function scrollReducer(state = defaultState, action) {
	switch(action.type)
	{
		case `SCROLL`:
		console.log("SCROLL!!!")
			return {...state, scrollValue:action.value};
			break;
		default :
			return state;
	}
};