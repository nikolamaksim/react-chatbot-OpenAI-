import React from "react";
import Interface from "../components/Interface";
import Header from "../components/Header";

export default function Body () {
    return (
        <div className="h-screen">
            <div className="h-16">
                <Header />
            </div>
            <div className="bg-gray-100">
                <Interface />
            </div>
        </div>
    )
}