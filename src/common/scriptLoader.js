import { document } from 'browser-monads';

const defaultCallback = (loaded,src)=>console.log(`${loaded?'Success':'Error'} loading script ${src}`);

export const loadScript = props => {
	const scriptElem = document.createElement('script');
	const {script,src,callback,id} = props;
	const cb = typeof callback === 'function' ? callback : defaultCallback;
	if(null === scriptElem || undefined === scriptElem)
	{
		return;
	}
	const uid = id ? id : btoa(script);//prevent loading script twice, maybe should be slow for big scripts
	const existingElement = document.getElementById(uid);

	if(existingElement)
	{
		existingElement.remove();
		console.log("removing old");
	}

	scriptElem.id = uid;
	//('function' === typeof script) ? scriptElem.innerHTML = script :  scriptElem.src = script;
	if(src)
	{
		scriptElem.src = src;
	}else
	{
		scriptElem.innerHTML = script;
	}
	scriptElem.addEventListener('load', () => cb(null, script));
  	scriptElem.addEventListener('error', () => cb(true, script));
  	document.body.appendChild(scriptElem);
  	console.log("script added ");
}

export const removeScript = (id) => {
    const script = document.getElementById(id);
    if (script)
        script.parentElement.removeChild(script);
}
