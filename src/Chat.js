import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom'
import './Chat.css';
import Pusher from 'pusher-js';
import { Avatar, IconButton } from '@material-ui/core';
import MoreVert from '@material-ui/icons/MoreVert';
import {
	AttachFile,
	InsertEmoticon,
	SearchOutlined
} from '@material-ui/icons';
import MicIcon from '@material-ui/icons/Mic'
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import axios from './axios'

Pusher.logToConsole = true;
// set pusher client key

//dev
const pusher = new Pusher('d7237d909a71b2a779b3', {
	cluster: 'ap4',
});

const useStyles = makeStyles((theme) => ({
	formControl: {
		margin: theme.spacing(1),
		minWidth: 120,
	},
	selectEmpty: {
		marginTop: theme.spacing(2),
	},
}));

//staging
// const pusher = new Pusher('b97f99bfc99522fcc8ba', {
// 	cluster: 'ap4',
// });

function Chat() {

	//set the states
	const [input, setInput] = useState("");
	const [languageTo, setLanguageTo] = useState('en');
	const [languageFrom, setLanguageFrom] = useState('en');
	const [language, setLanguage] = useState('')
	const [chatId, setChatId] = useState("");
	const [isHost, setIsHost] = useState();

	// used for messages input by user
	const [messages, setMessages] = useState([]);

	// used for translated objects when event comes back
	const [translatedMessages, setTranslatedMessages] = useState([])

	const history = useHistory();
	const classes = useStyles();
	const [eventIds, setEventIds] = useState([]);

	// handle messages coming through from pusher
	useEffect(() => {
		const channel = pusher.subscribe(`conversations_${chatId}`);
		// const channel = pusher.subscribe('conversations');
		channel.bind('updated', async (data) => {
			console.log('Event data',data)
			// console.log('data', data._id);
			// console.log('data.text', data.message)
			// console.log('Check eventIds', messages.includes(data));
			// console.log('check indexof', messages.indexOf(data._id))
			// if (!eventIds.includes(data._id)) {
			// 	setMessages([...messages, data]);
			// 	console.log('adfas')
			// 	setEventIds([...eventIds, data._id]);
			// }
			// setTranslatedMessages([...translatedMessages, data])
			// setMessages([...messages, data]);
			if (!eventIds.includes(data._id)) {
				console.log('eventIds', eventIds);
				console.log('data_id', data._id);
				const translate_payload = {
					text: data.message,
					from: data.lang_to,
					to: language,
				};
				console.log('translate_payload', translate_payload);

				//translate the text
				const response = await axios.post('/az/translate', translate_payload);
				const translated_text = response.data[0].text;
				console.log('translated_text', translated_text)
				if (translated_text) {
					const msg_update_payload = {
						chatId: chatId,
						messageId: data._id,
						message: data.message,
						username: isHost ? 'Adrian' : 'Donor',
						translated_message: translated_text,
						lang_to: language,
						timestamp: 'sometimestamp',
					};
					// update message the same message ID with the updated translated_text field
					// create new API for this
					console.log('msg_update_payload', msg_update_payload);
					const update_msg_res = await axios.post(
						'/api/updatemessage',
						msg_update_payload
					);
					setTranslatedMessages([...translatedMessages, translated_text]);
					// setMessages([...messages, ])

				}
			}
			

			// set the payload to translate
			

			// console.log('translate_payload', translate_payload);

			// //translate the text
			// const response = await axios.post('/az/translate', translate_payload);
			// const translated_text = response.data[0].text;
			// console.log('translated_text', translated_text)
			// if (translated_text) {
			// 	//update message

			// 	setTranslatedMessages([...translatedMessages, translated_text]);
			// }
		});
		return () => {
			channel.unsubscribe();
			channel.unbind_all();
		};
	}, [messages, translatedMessages, eventIds]);

	// join the conversation
	const joinConversation = async(e) => {
		e.preventDefault();
		setMessages([]);
		setChatId(chatId)
		setIsHost(false)
		setLanguage(language)

		// const payload_lang = {
		// 	chatId: chatId,
		// 	lang_to: language
		// }
		// const lang_res = axios.post('/setlanguage', payload_lang)
		// if(lang_res) {
			
		// }
		// console.log(lang_res)
		history.push('/'+chatId)
	}

	// start the conversation                      
	const startConversation = async (e) => {
		e.preventDefault();
		const startConvRes = await axios
			.post('/startconversation', {
				lang_from: language,
				lang_to: null
			})
		setChatId(startConvRes.data._id);
		setMessages([]) 
		setIsHost(true)
		setTranslatedMessages([])
		history.replace('/'+startConvRes.data._id)
	}

	// end the conversation
	const endConversation = async (e) => {
		const endconv_payload = {
			chatId: chatId,
		};
		const endConRes = await axios.post('/endconversation', endconv_payload)
		if (endConRes){
			setChatId('')
			setMessages([])
			setTranslatedMessages([])
		}
	};

	// send message to conversation
	const sendMessage = async (e) => {
		e.preventDefault();

		//set messeage in UI first
		//this is to avoid the delay from the sender
		const msg_payload = {
			chatId: chatId,
			message: input,
			username: 'adrian',
			translated_message: '',
			lang_to: language,
			timestamp: "sometimestamp",
		};
		// setMessages([...messages, input]);
		setMessages([...messages, msg_payload]);
		setInput('');

		// set the language to translate to and from
		// if langauge is set every subsequent message will not
		// make this call again
		// if (!languageFrom && !languageTo){
		//get the "from and to" langauges
		// const res = await axios.post('/getlanguage', { chatId: chatId });
		// console.log('/getlanguage called', res.data)

		// if (isHost) {
		// 	setLanguageFrom(res.data.lang_from);
		// 	setLanguageTo(res.data.lang_to);
		// } else {
		// 	setLanguageFrom(res.data.lang_to);
		// 	setLanguageTo(res.data.lang_from);
		// }
		// }

		//set payload to save message in database with translated text
		// const msg_payload = {
		// 	chatId: chatId,
		// 	message: input,
		// 	username: 'adrian',
		// 	translated_message: null,
		// 	// isHost: true,
		// };

		//save message in database
		const msg_response = await axios.post('/api/message', msg_payload);
		console.log('msg_response',msg_response)
		setEventIds(msg_response.data._id)

		//set the payload to translate
		// const translate_payload = {
		// 	text: input,
		// 	from: languageFrom,
		// 	to: languageTo,
		// };

		// console.log('translate_payload', translate_payload);

		// //translate the text
		// const response = await axios.post('/az/translate', translate_payload);
		// const translated_text = response.data[0].text;
	}


	const handleChange = (event) => {
		event.preventDefault()
		setLanguage(event.target.value);
	};

	// console.log('ChatId:', chatId);
	// console.log(input)
	console.log('MESSAGES', messages)
	// console.log('TRANSLATEDMESSAGES', translatedMessages);
	// console.log('isHost', isHost)
	console.log('Language', language)
	// console.log('languageFrom', languageFrom);
	// console.log('languageTo', languageTo);
  return (
		<div className='chat'>
			<div className='chat__header'>
				<Avatar />

				<div className='chat__headerInfo'>
					<h3>Transmate</h3>
					<p>Last seen at...</p>
				</div>

				<div className='chat__headerRight'>
					<IconButton>
						<SearchOutlined />
					</IconButton>
					<IconButton>
						<AttachFile />
					</IconButton>
					<IconButton>
						<MoreVert />
					</IconButton>
				</div>
			</div>
			<div className='chat__body'>
				{messages.map((message) => (
					<p className={`chat__message ${message.message && 'chat__receiver'}`}>
						<span className='chat__name'>{message.username}</span>
						{/* { message.isHost ? message.message : message.translated_message } */}
						{message.message}
						<span className='chat__timestamp'>{message.timestamp}</span>
						{/* <span>{message.translated_message}</span> */}
					</p>
				))}
			</div>
			<div className='chat__translatedbody'>
				{translatedMessages.map((translatedmessage) => (
					<p
						className={`chat__message ${translatedmessage && 'chat__receiver'}`}
					>
						<span className='chat__name'>{translatedmessage}</span>
						{isHost
							? translatedmessage.message
							: translatedmessage.translated_message}
						{translatedmessage}
						<span className='chat__timestamp'>
							{translatedmessage.timestamp}
						</span>
						<span>{translatedmessage.translated_message}</span>
					</p>
				))}
			</div>

			<div className='chat__footer'>
				<InsertEmoticon />
				<form>
					<input
						value={input}
						onChange={(e) => setInput(e.target.value)}
						placeholder='Type a messeage'
						type='text'
					/>
					<button disabled={!input} onClick={sendMessage} type='submit'>
						Send a message
					</button>
					<MicIcon />
				</form>
				<button onClick={startConversation}>Start Conversation</button>
				<button onClick={endConversation}>End Conversation</button>
				<form>
					<input
						value={chatId}
						onChange={(e) => setChatId(e.target.value)}
						placeholder='Enter chatId'
					/>
					<button onClick={joinConversation}>Join Conversation</button>
				</form>
				<FormControl className={classes.formControl}>
					<InputLabel id='demo-simple-select-label'>Language</InputLabel>
					<Select
						labelId='demo-simple-select-label'
						id='demo-simple-select'
						value={language}
						onChange={handleChange}
					>
						<MenuItem value={'en'}>English</MenuItem>
						<MenuItem value={'fr'}>French</MenuItem>
						<MenuItem value={'es'}>Spanish</MenuItem>
						<MenuItem value={'ar'}>Arabic</MenuItem>
						<MenuItem value={'vi'}>Vietnamese</MenuItem>
						<MenuItem value={'fa'}>Persian/Farsi</MenuItem>
						<MenuItem value={'zh-Hans'}>Chinese</MenuItem>
						<MenuItem value={'yue'}>Cantonese</MenuItem>
						<MenuItem value={'th'}>Thai</MenuItem>
						<MenuItem value={'ko'}>Korean</MenuItem>
						<MenuItem value={'yue'}>Cantonese</MenuItem>
					</Select>
				</FormControl>
			</div>
		</div>
	);
}

export default Chat
