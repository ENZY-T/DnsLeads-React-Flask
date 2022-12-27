import axios from 'axios';

export const localStoreKeys = {
	authKey: '',
};

export function setItemToLocalStorage(key, value) {
	window.localStorage.setItem(key, value);
}

export function getItemFromLocalStorage(key) {
	return window.localStorage.getItem(key);
}

export function removeItemFromLocalStorage(key) {
	window.localStorage.removeItem(key);
}

// use this function for request backend for posting data
export async function reqToBackend(link, data = {}) {
	const accessToken = getItemFromLocalStorage(localStoreKeys.authKey);
	let returnData = {};
	axios
		.post(link, data, {
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
		})
		.then((response) => {
			returnData = response;
		})
		.catch((err) => {
			window.location = '/login';
		});

	return returnData;
}

export function authToken(history) {
	const accessToken = getItemFromLocalStorage(localStoreKeys.authKey);
	let userID = undefined;
	if (accessToken) {
		axios
			.post(
				'/api/auth/authorization-token',
				{},
				{
					headers: {
						Authorization: `Bearer ${accessToken}`,
					},
				},
			)
			.then((response) => {
				userID = response.data;
				// console.log(response);
			})
			.catch((error) => {
				history.push('/login');
				removeItemFromLocalStorage(localStoreKeys.authKey);
			});
	} else {
		history.push('/login');
	}
	return userID;
}
