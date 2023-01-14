// import the packages 
import MarkdownIt from 'markdown-it';
import MarkdownItContainer from 'markdown-it-container';
import markdownItKatex from 'markdown-it-katex';

// takes in Edu-Md content and returns a formatted string of HTML:
function parseMarkdown(content){
    const parser = MarkdownIt({
        breaks: true,
        typographer: true,
        // See all settings in markdown-it doc
    })
    .use(markdownItKatex)
    .use(MarkdownItContainer, 'classname', {
        validate: name => name.trim().length,
        render: (tokens, idx) => {
            const blockType = tokens[idx]?.info?.trim().split(" ")[0];
            if (tokens[idx].nesting === 1) {
                let returnString = `<div class="${tokens[idx].info.trim()}">\n`;
                switch(blockType){
                    case "youtube":
                        var m = tokens[idx].info.trim().match(/^youtube\s+(.*)$/);
                        if(isValidVideoId(m[1])) returnString += getYouTubeComponentString({videoId: m[1]});
                        break;
                    case "desmos":
                        var m = tokens[idx].info.trim().match(/^desmos\s+(.*)$/);
                        returnString += getDesmosComponentString({graphId: m[1]});
                        break;
                    default: 
                        break;
                }
                return returnString;
            } else {
                return '</div>\n';
            }
        }
    });
    return parser.render(content);
}
// Randering embedded content
function getYouTubeComponentString(videoId){
   return `<iframe src="https://www.youtube-nocookie.com/embed/${videoId}" />`;
}
function getDesmosComponentString(graphId){
   return `<iframe src="https://www.desmos.com/calculator/${graphId}?embed" />`;
}