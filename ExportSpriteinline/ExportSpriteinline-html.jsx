//*************************************************************************************************************
/** @file ExportToEdgeAnimate.jsx
	@author Avinash Rao P <arao@adobe.com> This work is released to Public Domain, do whatever you want with it.

Setup:
1.Ensure that you have the latest version of Adobe Adobe Photoshop CC installed. 
    Copy the attached extension file ExportToEdgeAnimate.jsx ) to Scripts folder in Adobe Photoshop  Install location.  
        Mac: <hard drive>/Applications/Adobe Photoshop  CC/Presets/Scripts/
        PC: C:\Program Files\Adobe\Adobe Photoshop  CC\Presets\Scripts\
2.Restart Adobe Photoshop  and ensure you see the script loaded , File -> Scripts -> ExportToEdgeAnimate
3.The following assumptions are made by the extend script:

Optional Setup:
1.PLEASE SAVE AND BACKUP YOUR PSD FILE!!
2.Increase the history states count ( optional ) if you want the psd file restored back to its original state




# Modifié par Christophe BERNARD pour créer un export d'un sprite en ligne
*/
//*************************************************************************************************************

// Save the current preferences
var startRulerUnits = app.preferences.rulerUnits;
var startTypeUnits = app.preferences.typeUnits;
var startDisplayDialogs = app.displayDialogs;


var layerNum = app.activeDocument.layers.length;
var docWidth = app.activeDocument.width;
var docHeight = app.activeDocument.height;
var rows;
var columns;
var activeLayerCount = 0;

var OUTPUT_FORMAT = 'html';
var fps = 30;

var docName = app.activeDocument.name.toString().replace(".psd", "");


//Edge Animate needs a json file with META header.
function outputEAS(doc) {
    var i = doc.layers.length - 1;
    var limit = 0;
    var format = OUTPUT_FORMAT.toLowerCase();
    var Path = app.activeDocument.path;
    var saveFile = File(Path + "/" + docName + "." + format);
    var spriteSpeed = layerNum/fps;



    if (saveFile.exists)
        saveFile.remove();

    //Edge Animate works with UTF8 encoded json files
    saveFile.encoding = "UTF8";
    saveFile.open("e", "TEXT", "????");
    saveFile.write('\ufeff');
    /* ecriture HTML */
    saveFile.writeln('<!-- sprite'+docName+'-->');
    saveFile.writeln('<head>');
     saveFile.writeln('<title></title>');
     saveFile.writeln('</head>');
     saveFile.writeln('<style type="text/css">');

     /*ecriture CSS */
    saveFile.writeln('.'+docName+'{');
    saveFile.writeln( 'width:'+docWidth.toString().replace("px","")*1+'px;');
    saveFile.writeln( 'height:'+docHeight.toString().replace("px","")*1+'px;');
    saveFile.writeln( 'background: url("'+docName+'.png") left center;');
    saveFile.writeln( 'animation:'+docName+'-animation'+' '+spriteSpeed+'s steps('+(layerNum-1)+') infinite;');
    saveFile.writeln('}');


    saveFile.writeln('@keyframes'+' '+docName+'-animation{');
    saveFile.writeln('100% {');
    saveFile.writeln('background-position:-'+(docWidth.toString().replace("px","")*(layerNum-1))+'px;');
     saveFile.writeln('}');
    saveFile.writeln('}');
   /* ecriture fin HTML */

    saveFile.write('</style>');
    saveFile.write('<body>');
    saveFile.write('<div class="'+docName+'"></div>');
    saveFile.write('<html>');
    saveFile.write('</body>');
    saveFile.write('</html>');



    saveFile.close();
};


//Exports the packed sprite to PNG format in the root folder
function saveTheFileToPNG() {
    var doc = app.activeDocument;
    var Path = doc.path;
    var saveFile = File(Path + "/" + docName + ".png");
    var pngSaveOptions = new PNGSaveOptions();
    pngSaveOptions.transparency = true;
    pngSaveOptions.format = SaveDocumentType.PNG; // Document Type
    doc.saveAs(saveFile, pngSaveOptions, true, Extension.LOWERCASE);
    outputEAS(doc);
    //comment this out incase you dont need an alert dialog
    alert("Le sprite en ligne et le HTML correspondant ont été généré!");
};

function translateActiveLayer(deltaX, deltaY) {
    //see http://wwwimages.adobe.com/content/dam/Adobe/en/devnet/photoshop/pdfs/photoshop-cc-scripting-guide.pdf on how to use script listener.
    var desc = new ActionDescriptor();
    var ref = new ActionReference();
    ref.putEnumerated(charIDToTypeID('Lyr '), charIDToTypeID('Ordn'), charIDToTypeID('Trgt'));
    desc.putReference(charIDToTypeID('null'), ref);
    var coords = new ActionDescriptor();
    coords.putUnitDouble(charIDToTypeID('Hrzn'), charIDToTypeID('#Pxl'), deltaX);
    coords.putUnitDouble(charIDToTypeID('Vrtc'), charIDToTypeID('#Pxl'), deltaY);
    desc.putObject(charIDToTypeID('T   '), charIDToTypeID('Ofst'), coords);
    executeAction(charIDToTypeID('move'), desc, DialogModes.NO);
};

function main() {
    // Set Photoshop to use pixels and display no dialogs
    app.preferences.rulerUnits = Units.PIXELS;
    app.preferences.typeUnits = TypeUnits.PIXELS;
    app.displayDialogs = DialogModes.NO;

    //preserve history 
    var historyIndex = app.activeDocument.historyStates.length - 1;

    rows = 1;
    columns = layerNum;

    app.activeDocument.resizeCanvas(docWidth * columns, docHeight * rows, AnchorPosition.TOPLEFT);

    for (var rowCount = 1; rowCount <= rows; rowCount++) {
        for (var colCount = 1; colCount <= columns; colCount++) {
            activeLayerCount++;
            if (layerNum >= activeLayerCount) {
                app.activeDocument.activeLayer = activeDocument.layers[layerNum - activeLayerCount];
                translateActiveLayer(docWidth * (colCount - 1), docHeight * (rowCount - 1));
            };
        };
    };

    //Save the spritesheet packaged above in png format.
    saveTheFileToPNG();

    //restore the history 
    app.activeDocument.activeHistoryState = app.activeDocument.historyStates[historyIndex];
    app.purge(PurgeTarget.HISTORYCACHES);

    // Reset the application preferences
    app.preferences.rulerUnits = startRulerUnits;
    app.preferences.typeUnits = startTypeUnits;
    app.displayDialogs = startDisplayDialogs;
};


if (!app.activeDocument.saved)
    alert("Please save and Backup the document before running this !");
else
    main();