import TexCatySup from "../assets/TexCatySup.png"
export default function MainPage() {
    return (
        <div>
            <div className="flex justify-center items-center bg-black h-96">
                <h1 className="text-white text-3xl">Поддержка нашей компании работает 24/7</h1>
            </div>
            <div className="flex flex-row mt-20 p-5 items-center">
                <div>
                    <h1 className="text-4xl font-bold leading-normal ml-10">Давайте расскажем немного о <br/> нашей
                        команде
                    </h1>
                    <p className="text-2xl leading-normal ml-10 pt-5">Наша команда состоит из не маленького штата
                        сотрудников,<br/>
                        включающего специалистов с глубокими знаниями и опытом в сфере<br/>
                        технической поддержки.</p>
                </div>
                <div className="border flex justify-center items-center w-[50%] h-auto ">
                    <img className="h-[30rem] w-auto" src={TexCatySup} alt=""/>
                </div>

            </div>

            {/*<h1 className="flex text-black text-3xl justify-center mt-10 mb-10">Часто задаваемые вопросы</h1>*/}
            {/*<div className="flex flex-row justify-between items-center h-96 p-4">*/}
            {/*    <div className="bg-gray-700 h-auto w-56 m-4 rounded-xl">*/}

            {/*    </div>*/}

            {/*    <div className="bg-gray-700 h-auto w-56 m-4 rounded-xl">*/}

            {/*    </div>*/}

            {/*    <div className="bg-gray-700 h-auto w-56 m-4 rounded-xl">*/}

            {/*    </div>*/}

            {/*    <div className="bg-gray-700 h-auto w-56 m-4 rounded-xl">*/}

            {/*    </div>*/}
            {/*</div>*/}
        </div>
    )
}