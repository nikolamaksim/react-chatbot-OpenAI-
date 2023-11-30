import React, {Fragment, useState, useRef } from "react";
import axios from 'axios';
import { Transition, Dialog } from "@headlessui/react";

import serverUrl from './../config/serverUrl.config.json';
import { useDispatch } from "react-redux";
import { setPageUpdate } from "../redux/pageUpdateSlice";

export default function AddPromptModal ({
    promptType,
    editPromptId,
    promptText,
    addPromptModalSetting,
}) {

    const dispatch = useDispatch();

    const [open, setOpen] = useState(true);
    const cancelButtonRef = useRef(null);

    const promptTypes = {
        'addSystem': 'Add System',
        'addUser': 'Add User',
        'editSystem': 'Edit System',
        'editUser': 'Edit User',
    }

    const [text, setText] = useState(promptText);

    // Add New Prompt
    const add = async (promptType) => {
        const res = await axios.post(`${serverUrl.serverUrl}/add`, {
            text: text,
            type: promptType,
        });
        if (res.data.code === 200) {
            alert(`${promptTypes[promptType]} Prompt Successfully Done.`)
        } else {
            alert('Ooops. Something went wrong. Please retry.')
        };
        addPromptModalSetting();
        dispatch(setPageUpdate());
    }

    // Edit Selected Prompt
    const edit = async (id) => {
        const res = await axios.post(`${serverUrl.serverUrl}/edit/${id}`, {
            text: text,
        });
        if (res.data.code === 200) {
            alert(`${promptTypes[promptType]} Prompt Successfully Done.`)
        } else {
            alert('Ooops. Something went wrong. Please retry.')
        };
        addPromptModalSetting();
        dispatch(setPageUpdate());
    };

    const handleSubmit = (promptType) => {
        if (!text) {
            alert('Hey, Please fill out the text area.')
        } else {
            if (promptType === 'addSystem' || promptType === 'addUser') {
                add(promptType);
            } else {
                edit(editPromptId);
            }
        }
    }

    return (
        <Transition.Root show={open} as={Fragment}>
            <Dialog
                as="div"
                className="relative z-10"
                initialFocus={cancelButtonRef}
                onClose={setOpen}
            >
                <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
                >
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                </Transition.Child>

                <div className="fixed inset-0 z-10 overflow-y-auto">
                    <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0 ">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            enterTo="opacity-100 translate-y-0 sm:scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        >
                        <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg overflow-y-scroll">
                            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left ">
                                <Dialog.Title
                                    as="h3"
                                    className="text-lg  py-4 font-semibold leading-6 text-gray-900 "
                                >
                                    Prompt Modal
                                </Dialog.Title>
                                <div className="w-full">
                                    <label
                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                    htmlFor="prompt"
                                    >
                                        {promptTypes[promptType]} Prompt
                                    </label>
                                    <textarea
                                        className="min-h-[200px] bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                        type="prompt"
                                        id="prompt"
                                        name="prompt"
                                        value={text}
                                        onChange={(e) => setText(e.target.value)}
                                        placeholder={`Text Area For ${promptTypes[promptType]} Prompt`}
                                    />
                                </div>
                            </div>
                            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                <button
                                    type="button"
                                    className="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:ml-3 sm:w-auto"
                                    onClick={() => handleSubmit(promptType)}
                                >
                                    {promptTypes[promptType]} Prompt
                                </button>
                            </div>
                        </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
    )
}