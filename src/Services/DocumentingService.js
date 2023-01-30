export const GeneratePdfFromHtml = (htmlElement, readyCallback) => {
    const element = htmlElement;
    const newWindow = window();
    newWindow.document.write(element.innerHTML);
    window.document = newWindow.document;
    window.print();
};
