# EDU-MD
Markdown extension standards for educational content  
中文版的 README 文件：[點此](/README-zh.md)

---

## Purpose  
The Markdown standard provides people with an easy way to create formatted documents, without having to deal with complex structures seen in formats like Wikitext and Office XML. However, the textual nature of markdown means that it is impossible to include more complex multimedia content.  
  
In building an opensource educational platform, our team wanted to take advantage of the simplicity of Markdown yet needed to handle more diverse and complex media formats. Hence, we developed this standard.  

> Edu-Md is **a format that extends from the original Markdown format**, enabling more complex and multimedia content to be presented in a Markdown document.  
  
Because of the opensource nature of our platform we decided to open this standard to everyone to perhaps contribute to a more open world for educational technology.  
  
## Format 
Edu-Md is built as an extension to the Markdown format, meaning that [everything included in the original Markdown format](https://www.markdownguide.org/basic-syntax/) is supported. The following formats are the current Edu-Md extensions:  

### Embedded YouTube Video
Replace `{video_id}` (including curly brackets) with the [YouTube video ID](https://stackoverflow.com/a/8260383/8109320): 
```
::: youtube {video_id}
:::
```

### Embedded Desmos Graphs 
Replace `{graph_id}` (including curly brackets) with the Desmos graph ID: 
```
::: desmos {graph_id}
:::
```

### Latex Math Symbols 
For inline math symbols, include the texts between single dollar signs `$`:
```
$This$ is displayed in a very math-looking style. 
```
For entire math blocks, start and end the line with double dollar signs `$$`:
```
$$ E_{m} = m \cdot c^2 $$
```

### Keyword Block 
Include the text as such: 
```
::: keyword
text here
:::
```

### Suggestion Block
Include the text as such: 
```
::: suggestion
text here
:::
```

### Attribution Block
Include the text as such: 
```
::: attribution
text here
:::
```

### Translation Block 
Include the text as such: 
```
::: translation
text here
:::
```

## For Developers  
The JavaScript example to render Edu-Md content is provided here. We do, however, encourage contributions in other languages. 
### If you're a web developer: 
1. We suggest using [Markdown-it](https://github.com/markdown-it/markdown-it), [Markdown-it-container](https://github.com/markdown-it/markdown-it-container), [Markdown-it-katex](https://github.com/waylonflinn/markdown-it-katex) to render the markdown content. Import the packages: 
  
   ```js
    import MarkdownIt from 'markdown-it';
    import MarkdownItContainer from 'markdown-it-container';
    import markdownItKatex from 'markdown-it-katex';
   ```
   This function, `parseMarkdown` takes in Edu-Md content and returns a formatted string of HTML: 
   ```js
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
   ```
   You can implement `getYouTubeComponentString()` and `getDesmosComponentString()` easily: 
   ```js
   function getYouTubeComponentString(videoId){
      return `<iframe src="https://www.youtube-nocookie.com/embed/${videoId}" />`;
   }
   function getDesmosComponentString(graphId){
      return `<iframe src="https://www.desmos.com/calculator/${graphId}?embed" />`;
   }
   ```
   If you are using frameworks like React and want more control, these functions could be harder to implement. You might want to look into [`ReactDomServer.renderToString`](https://reactjs.org/docs/react-dom-server.html#rendertostring). 
2. Remember to implement styles for the following CSS classes, scoped to your content: 
  
   ```css
   .youtube{}
   .desmos{}
   .keyword{}
   .suggestion{}
   .attribution{}
   .translation{}
   ```


## Support Badge
If you find this standard or the example helpful, consider kindly include the following badge close to your content. This badge is available in the [badge folder](/badge/).

![Edu-Md Badge](/badge/Edu-Md-badge.svg)

## Contribute  
The current Edu-Md format is explained above, but there are still many types of multimedia content that can be valuable to educational content. Contribute to this format by opening new branches and committing to them.  

Start by cloning the repository. 
```
git clone https://github.com/zetria-org/edu-md.git
```