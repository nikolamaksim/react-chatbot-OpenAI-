
import axios from "axios";
import React, { useEffect, useState } from "react";

import OpenAI from "openai";

import serverUrl from './../config/serverUrl.config.json';
import { useDispatch, useSelector } from "react-redux";
import { setPageUpdate } from "../redux/pageUpdateSlice";
import AddPromptModal from "./AddPromptModal";
import { Popover, PopoverHandler, PopoverContent } from "@material-tailwind/react";

let loadingText = false; 

export default function Interface() {

    const oepn_ai_api_key = process.env.REACT_APP_OPENAI_API_KEY;

    const openai = new OpenAI({
        apiKey: oepn_ai_api_key,
        dangerouslyAllowBrowser: true,
    });

    const dispatch = useDispatch();
    const pageUpdate = useSelector((state) => state.pageUpdate);

    const [loading, setLoading] = useState(false);
    const [submitSystemPrompt, setSubmitSystemPrompt] = useState('');
    const [submitUserPrompt, setSubmitUserPrompt] = useState('');
    const [responseMessage, setResponseMessage] = useState('');

    const [selectedSystemRow, setSelectedSystemRow] = useState(null);
    const [selectedUserRow, setSelectedUserRow] = useState(null);

    const [showAddPromptModal, setShowAddPromptModal] = useState(false);
    const [promptType, setPromptType] = useState('');
    const [editPromptId, setEditPromptId] = useState('')
    const [promptText, setPromptText] = useState('');

    const addPromptModalSetting = (promptType, promptText, editPromptId) => {
        setPromptType(promptType);
        setEditPromptId(editPromptId);
        setPromptText(promptText);
        setShowAddPromptModal(!showAddPromptModal);
    }

    const [prompts, setPrompts] = useState({
        system: [],
        user: [],
    })

    // Fetch All Prompts
    const fetchPrompts = async () => {
        const res = await axios.post(`${serverUrl.serverUrl}/read`);
        setPrompts({
            system: res.data.body.system,
            user: res.data.body.user,
        });
    }

    // Delete Selected Prompt
    const deletePrompt = async (id) => {
        const confirm = window.confirm('Are you sure you want to delete this prompt?');
        if (confirm) {
            const res = await axios.post(`${serverUrl.serverUrl}/delete/${id}`);
            if (res.data.code === 200) {
                alert('Successfully Deleted');
                dispatch(setPageUpdate());
            } else {
                alert('Ooops. Something went wrong. Please retry.')
            }
        }
    }

    // Submit Prompt
    const submitPrompt = async () => {
        if (submitSystemPrompt || submitUserPrompt) {
            try {
                setLoading(true);
                if (!loadingText) {
                    const stream = await openai.chat.completions.create({
                        model: 'gpt-3.5-turbo',
                        messages: [{
                            role: 'system',
                            content: submitSystemPrompt,
                        }, {
                            role: 'user',
                            content: submitUserPrompt,
                        }],
                        temperature: 0.7,
                        stream: true,
                    });
                    let content = ""
                    loadingText = true;
                    for await (const chunk of stream) {
                        if (!loadingText)
                            break;
                        content += chunk.choices[0].delta.content ? chunk.choices[0].delta.content : '';
                        setResponseMessage(content);
                    }
                    loadingText = false;
                    setLoading(false);
                };
            } catch (err) {
                console.log(err);
                setLoading(false);
                loadingText = false;
            }
        }
    }

    useEffect(() => {
        fetchPrompts();
    }, [pageUpdate])
    
    return (
        <>
        {
            showAddPromptModal && 
            <AddPromptModal 
                promptType={promptType}
                editPromptId = {editPromptId}
                promptText = {promptText}
                addPromptModalSetting={addPromptModalSetting}
            />
        }
            <div className="justify-center">
                <div className="grid grid-cols-1 col-span-12 lg:col-span-10 gap-6 lg:grid-cols-2  p-4 ">
                    {/* input and result boxes */}
                    <div className="flex flex-col gap-4 rounded-lg border border-gray-100 bg-white p-6 ">
                        {/* input box */}
                        <div>
                            <div>
                                <label
                                htmlFor="prompt-area"
                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                >
                                Prompt Area
                                </label>
                                <textarea
                                    name="prompt-area"
                                    id="prompt-area"
                                    style={{
                                        minHeight: '25vh'
                                    }}
                                    value={submitSystemPrompt + '\n' + submitUserPrompt}
                                    disabled
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                    placeholder="Please select the prompts."
                                />
                            </div>
                            <div className="px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                <button
                                    type="button"
                                    className={`inline-flex w-full justify-center rounded-md ${!loading ? 'bg-blue-600 hover:bg-blue-500' : 'bg-gray-600'} px-3 py-2 text-sm font-semibold text-white shadow-sm sm:ml-3 sm:w-auto`}
                                    onClick={() => submitPrompt()}
                                    disabled = {!loading ? false : true}
                                >
                                    {!loading ? 'Submit Text' : 'Generating...'}
                                </button>
                            </div>
                        </div>
                        {/* result box */}
                        <div>
                            <div>
                                <label
                                    htmlFor="result-area"
                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                >
                                    Result Area
                                </label>
                                <textarea
                                    name="result-area"
                                    id="result-area"
                                    style={{
                                        minHeight: '25vh'
                                    }}
                                    defaultValue={responseMessage}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                    placeholder="Result Area"
                                />
                            </div>
                            <div className="px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                {loading
                                ?
                                <button
                                    type="button"
                                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-100 sm:mt-0 sm:w-auto"
                                    onClick={() => {
                                        loadingText = false;
                                        setLoading(false)
                                    }}
                                >
                                    Stop Generation
                                </button>
                                :
                                <div className="mt-3">
                                </div>
                                }
                            </div>
                        </div>
                    </div>
                    {/* prompt lists */}
                    <div className="flex flex-col gap-4 rounded-lg border border-gray-100 bg-white p-6  ">
                        {/* System Prompt */}
                        <div className="bg-gray-800 text-white px-4 py-4">
                            <h3>System Prompts</h3>
                        </div>
                        <div className="table-section">
                            <table className="min-w-full divide-y-2 divide-gray-200 text-sm">
                                <tbody className="divide-y divide-gray-200">
                                    {prompts.system.map((prompt, index) => {
                                        return (
                                            <tr key={prompt.id} className="grid grid-cols-12 hover:bg-slate-100" style={{backgroundColor: selectedSystemRow === prompt.id ? 'powderblue' : 'white'}}>
                                                <td className="col-span-1 flex items-center px-4 py-2 text-gray-900 ">
                                                    {index + 1}
                                                </td>
                                                <Popover>
                                                    <PopoverHandler>
                                                        <td className="col-span-8 flex items-center px-4 py-2 text-gray-900 cursor-pointer">
                                                            <p>{prompt.prompt}</p>
                                                        </td>
                                                    </PopoverHandler>
                                                    <PopoverContent>
                                                        <p>{prompt.prompt}</p>
                                                    </PopoverContent>
                                                </Popover>
                                                <td className="col-span-1 px-4 py-2 text-gray-900">
                                                    <span
                                                        className="text-green-600 cursor-pointer"
                                                        onClick={() => {
                                                            setSubmitSystemPrompt(prompt.prompt);
                                                            setSelectedSystemRow(prompt.id);
                                                        }}
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.633 10.5c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75A2.25 2.25 0 0116.5 4.5c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23H5.904M14.25 9h2.25M5.904 18.75c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 01-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 10.203 4.167 9.75 5 9.75h1.053c.472 0 .745.556.5.96a8.958 8.958 0 00-1.302 4.665c0 1.194.232 2.333.654 3.375z" />
                                                        </svg>
                                                    </span>
                                                </td>
                                                <td className="col-span-1 px-4 py-2 text-gray-900">
                                                    <span
                                                        className="text-blue-600 cursor-pointer"
                                                        onClick={() => {addPromptModalSetting('editSystem', prompt.prompt, prompt.id)}}
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                                        </svg>
                                                    </span>
                                                </td>
                                                <td className="col-span-1 px-4 py-2 text-gray-900">
                                                    <span
                                                        className="text-red-600 cursor-pointer"
                                                        onClick={() => deletePrompt(prompt.id)}
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                                        </svg>
                                                    </span>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                        {/* User Prompt */}
                        <div className="bg-gray-800 text-white px-4 py-4">
                            <h3>User Prompts</h3>
                        </div>
                        <div className="table-section">
                            <table className="min-w-full divide-y-2 divide-gray-200 text-sm">
                                <tbody className="divide-y divide-gray-200">
                                    {prompts.user.map((prompt, index) => {
                                        return (
                                            <tr key={prompt.id} className="grid grid-cols-12 hover:bg-slate-100" style={{backgroundColor: selectedUserRow === prompt.id ? 'powderblue' : 'white'}}>
                                                <td className="col-span-1 flex items-center px-4 py-2 text-gray-900 ">
                                                    {index + 1}
                                                </td>
                                                <Popover>
                                                    <PopoverHandler>
                                                        <td className="col-span-8 flex items-center px-4 py-2 text-gray-900 cursor-pointer">
                                                            <p>{prompt.prompt}</p>
                                                        </td>
                                                    </PopoverHandler>
                                                    <PopoverContent>
                                                        <p>{prompt.prompt}</p>
                                                    </PopoverContent>
                                                </Popover>
                                                <td className="col-span-1 px-4 py-2 text-gray-900">
                                                    <span
                                                        className="text-green-600 cursor-pointer"
                                                        onClick={() => {
                                                            setSubmitUserPrompt(prompt.prompt);
                                                            setSelectedUserRow(prompt.id);
                                                        }}
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.633 10.5c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75A2.25 2.25 0 0116.5 4.5c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23H5.904M14.25 9h2.25M5.904 18.75c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 01-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 10.203 4.167 9.75 5 9.75h1.053c.472 0 .745.556.5.96a8.958 8.958 0 00-1.302 4.665c0 1.194.232 2.333.654 3.375z" />
                                                        </svg>
                                                    </span>
                                                </td>
                                                <td className="col-span-1 px-4 py-2 text-gray-900">
                                                    <span
                                                        className="text-blue-600 cursor-pointer"
                                                        onClick={() => {addPromptModalSetting('editUser', prompt.prompt, prompt.id)}}
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                                        </svg>
                                                    </span>
                                                </td>
                                                <td className="col-span-1 px-4 py-2 text-gray-900">
                                                    <span
                                                        className="text-red-600 cursor-pointer"
                                                        onClick={() => deletePrompt(prompt.id)}
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                                        </svg>
                                                    </span>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
