import {Link} from "react-router-dom";
import React from "react";
import logo from "../assets/logo.png"

export default function Layout({children}) {
    return (
        <>
            <div id={Layout.name} style={{justifyContent: 'space-between'}} className="layout flex mt-4  w-[50%] h-28 items-center ml-[20rem]
        font-montserrat">
                <div>
                    <img className="border w-24 h-auto" src={logo} alt="logo"/>
                </div>
                <div className="border flex justify-between w-[70%] text-black">

                    <Link className={'border'} to='/home'>О нас</Link>
                    <Link className={'border'} to='/Test'>Команда</Link>
                    <Link className={'border'} to='/'>FAQ</Link>
                    <button className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700">
                        Задать вопрос
                    </button>
                </div>


            </div>
            {children}
        </>
    )
}