import React from 'react';

const AboutUs = ({ text, headline, image, headlineWordsPerLine = 4, textWordsPerLine = 7 }) => {
    const formatTextWithLineBreaks = (text, wordsPerLine) => {
        const words = text.split(' ');
        const result = [];

        for (let i = 0; i < words.length; i += wordsPerLine) {
            const wordGroup = words.slice(i, i + wordsPerLine).join(' ');
            result.push(
                <React.Fragment key={i}>
                    {wordGroup}
                    <br />
                </React.Fragment>
            );
        }

        return result;
    };

    return (
        <div className="flex flex-col md:flex-row items-center p-6">
            <div className="w-full md:w-[60rem] flex flex-col justify-center">
                <h1 className="text-3xl md:text-4xl font-bold leading-normal text-center md:text-left">
                    {formatTextWithLineBreaks(headline, headlineWordsPerLine)}
                </h1>
                <p className="text-lg md:text-2xl leading-normal text-center md:text-left pt-5">
                    {formatTextWithLineBreaks(text, textWordsPerLine)}
                </p>
            </div>
            <div className="flex justify-center items-center w-full md:w-[50%] h-auto mt-4 md:mt-0">
                <img className="max-h-[26rem] w-auto" src={image} alt="About" />
            </div>
        </div>
    );
};

export default AboutUs;
