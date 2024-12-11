import { useState } from "react";

export default function Homepage() {
    const [inputText, setInputText] = useState("");
    const [outputText, setOutputText] = useState("");

    const parseMarkup = () => {
        let convertedHTML = "";
        let inList = false;

        const lines = inputText.split("\n");

        const patterns = {
            title: /^t: (.+) :t$/,
            subtitle: /^st: (.+) :st$/,
            paragraph: /^p: (.+) :p$/,
            listStart: /^l:$/,
            listItem: /^e: (.+) e:$/,
            listEnd: /^:l$/,
            spacer: /^tv::$/,
            comment: /^com: (.+) :com$/
        };

        lines.forEach((line) => {
            line = line.trim();

            if (patterns.title.test(line)) {
                const match = line.match(patterns.title);
                convertedHTML += `<h1>${match[1]}</h1>\n`;

            } else if (patterns.subtitle.test(line)) {
                const match = line.match(patterns.subtitle);
                convertedHTML += `<h2>${match[1]}</h2>\n`;

            } else if (patterns.paragraph.test(line)) {
                const match = line.match(patterns.paragraph);
                convertedHTML += `<p>${match[1]}</p>\n`;

            } else if (patterns.listStart.test(line)) {
                if (!inList) {
                    convertedHTML += `<ul>\n`;
                    inList = true;
                }

            } else if (patterns.listItem.test(line)) {
                if (inList) {
                    const match = line.match(patterns.listItem);
                    convertedHTML += `<li>${match[1]}</li>\n`;
                }

            } else if (patterns.listEnd.test(line)) {
                if (inList) {
                    convertedHTML += `</ul>\n`;
                    inList = false;
                }

            } else if (patterns.spacer.test(line)) {
                convertedHTML += `<div style="height: 20px;"></div>\n`;
                
            } else if (patterns.comment.test(line)) {
                const match = line.match(patterns.comment);
                convertedHTML += `<div style="color: grey; font-style: italic;">${match[1]}</div>\n`;
            }
        });

        if (inList) {
            convertedHTML += `</ul>\n`;
        }

        setOutputText(convertedHTML);
    };

    return (
        <>
            <h1>Convertor Text to Custom HTML</h1>

            <div className="app-wrapper">
                <div className="left-side">
                    <h3>Introduceți textul aici</h3>
                    <textarea
                        id="input-text"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        rows={10}
                        style={{ width: "100%" }}
                    ></textarea>
                    <button className="convert-button" onClick={parseMarkup}>
                        Convert
                    </button>
                </div>
                <div className="right-side">
                    <h3>Output</h3>
                    <div
                        id="output-text"
                        style={{ whiteSpace: "pre-wrap", backgroundColor: "#f9f9f9", padding: "10px", border: "1px solid #ccc" }}
                        dangerouslySetInnerHTML={{ __html: outputText }}
                    ></div>
                </div>
            </div>
        </>
    );
}

// t: Titlu Principal :t
// st: Subtitlu :st
// p: Acesta este un paragraf. :p
// l:
// e: Primul element e:
// e: Al doilea element e:
// :l
// tv::
// com: Acesta este un comentariu. :com