export type TStyle = 'bold' | 'italic' | 'underline';

export const  applyStyle= (type: TStyle, selectedText:string) => {
    
    let formattedText = selectedText;

    switch (type) {
        case 'bold':
            formattedText = '**' + selectedText + '**';
            break;
        case 'italic':
            formattedText = '*' + selectedText + '*';
            break;
        case 'underline':
            formattedText = '~~' + selectedText + '~~';
            break;
        default:
            formattedText = selectedText;
                    
    }

    return formattedText;
} 