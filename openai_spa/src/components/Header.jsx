import React, { useState } from "react";
import AddPromptModal from "./AddPromptModal";

export default function Header () {

    const [showAddPromptModal, setShowAddPromptModal] = useState(false);
    const [promptType, setPromptType] = useState('')

    const addPromptModalSetting = (promptType) => {
        setPromptType(promptType);
        setShowAddPromptModal(!showAddPromptModal);
    }

    return (
        <>
        {
            showAddPromptModal && (
                <AddPromptModal 
                    promptType = {promptType}
                    addPromptModalSetting = {addPromptModalSetting}
                />
            )
        }
        <div className="min-h-full bg-gray-800">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    <div className="flex items-center">
                        <div className="flex-shrink-0 mx-4">
                            <button 
                                className="text-white px-2 cursor-pointer hover:text-gray-800 hover:bg-slate-300 font-bold p-2 rounded"
                                onClick={() => addPromptModalSetting('addSystem')}
                            >
                                Add System Prompt
                            </button>
                        </div>
                        <div className="flex-shrink-0 mx-4">
                            <button 
                                className="text-white px-2 cursor-pointer hover:text-gray-800 hover:bg-slate-300 font-bold p-2 rounded"
                                onClick={() => addPromptModalSetting('addUser')}
                            >
                                Add User Prompt
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}