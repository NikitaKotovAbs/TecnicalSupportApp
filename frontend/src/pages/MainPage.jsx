import TexCatySup from "../assets/TexCatySup.png";
import time24on7 from "../assets/24on7png.png";
import unlimited from "../assets/unlimited.png";
import clients from "../assets/clients.png";
import AboutUs from "../components/AboutUs.jsx";
import AboutUsReverse from "../components/AboutUsReverse.jsx";

export default function MainPage() {

    return (
        <div>
            <div
                className="relative flex justify-center items-center h-96 mt-24 bg-cover bg-center animate-fadeBackground z-0">

                <div className="absolute inset-0 bg-black bg-opacity-70"></div>


                <h1 className="relative text-white text-4xl font-bold text-center max-w-xl mx-auto">
                    Наша поддержка работает <span className="text-yellow-400">24/7</span>
                </h1>
            </div>

            <div className="flex flex-col mt-20 p-5">
                <AboutUs
                    headline="Давайте расскажем немного о нашей команде"
                    text="Наша команда состоит из не маленького штата сотрудников, включающего специалистов с глубокими знаниями и опытом в сфере технической поддержки."
                    image={TexCatySup}
                />
                <AboutUsReverse
                    headline="Круглосуточная поддержка"
                    text="Мы обеспечиваем круглосуточную помощь, чтобы гарантировать работу наших сервисов и решение любых вопросов пользователей в кратчайшие сроки."
                    image={time24on7}
                />
                <AboutUs
                    headline="Наши охваты безграничны"
                    text="Наша поддержка охватывает все этапы — от простых консультаций до устранения сложных технических проблем."
                    image={unlimited}
                />
                <AboutUsReverse
                    headline="Для каждого клиента у нас индивидуальный подход"
                    text="Каждый специалист работает с индивидуальным подходом к клиенту, обеспечивая высокий уровень сервиса и оперативное реагирование на любые запросы."
                    image={clients}
                />
            </div>
            <div className="">
                <div className="">

                </div>
                <div className="">

                </div>
                <div className="">

                </div>
            </div>
        </div>
    );
}
