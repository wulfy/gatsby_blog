import { document } from 'browser-monads';

const scriptElem = document.createElement('script');
const defaultCallback = (loaded,src)=>console.log(`${loaded?'Success':'Error'} loading script ${src}`);

const loadScript = props => {
	const {script,callback} = props;
	const cb = typeof callback === 'function' ? callback : defaultCallback;
	if(null === scriptElem || undefined === scriptElem)
	{
		return;
	}
	const uid = btoa(script);//prevent loading script twice
	const existingElement = document.getElementById(uid);

	if(existingElement)
		existingElement.remove();

	scriptElem.id = uid;
	//('function' === typeof script) ? scriptElem.innerHTML = script :  scriptElem.src = script;
	scriptElem.innerHTML = script;
	scriptElem.addEventListener('load', () => cb(null, script));
  	scriptElem.addEventListener('error', () => cb(true, script));
  	document.body.appendChild(scriptElem);
}

export default loadScript;