#target photoshop

// alert("CB-script - export all layers and export .json \n attention en cours de dev \n ne prend pas en compte les calques vides \n les groupes sont considérés comme des calques")
// Export Position
var doc = app.activeDocument;
var docPath = doc.path;
docPath = docPath + '/HTML';
var layers = doc.layers;
var layNum = layers.length;
var docName = app.activeDocument.name.toString().replace(".psd", "");
var folderExportName = "medias";

var exportLayers = {
    layersVisible: [],

    layersTypes: [
        {"anime": "_anim"},
        {"clickable": "_clickable"},
        {"item": "_item"},
    ],

    init : function(){

        //prend uniquement en compte les calques visibles
        this.utils.checkVisibleLayers();

        //export les images
        // this.exportAllArtLayertoPNG();

        //exports en différents formats les coordonnées
        // this.write.JS();
        // this.write.CSS();
        this.write.SCSS();
        this.write.HTML();

        // this.exportAllArtLayertoPNG();
        alert(" DONE !!\nLes fichiers ont été générées ici : "+ docPath);
    },
    
    write : {
        JS : function(){
            var myExport = '"use strict"\n\n';
            myExport += 'const Land =';
            myExport += '{\n\t\"layers\" : [\n';
            myExport += '\t\t{\n\t\t\"name\" : "tout",\n';
            myExport += '\t\t\"width\" :' + app.activeDocument.width.toString().replace(" px", "")+',\n';
            myExport += '\t\t\"height\" :' + app.activeDocument.height.toString().replace(" px", "")+',\n';
            myExport += '\t\t\"elements\" : [ \n';
            
          
            for(var i = 0; i < exportLayers.layersVisible.length; i++){
    
                var layerWidth = doc.artLayers[i].bounds[2].toString().replace(" px", "") - doc.artLayers[i].bounds[0].toString().replace(" px", "");
                var layerHeight = doc.artLayers[i].bounds[3].toString().replace(" px", "") - doc.artLayers[i].bounds[1].toString().replace(" px", "");
                // var layerScaleW = 1;
                // var layerScaleH = 1;
                myExport += '\t\t{\n';
                myExport += '\t\t\t'+'\"name\": \"' + exportLayers.utils.cleanName( doc.artLayers[i].name ) +'\",\n';
                myExport += '\t\t\t'+'\"posX\": ' + doc.artLayers[i].bounds[0].toString().replace(" px", "")+',\n' ;
                myExport += '\t\t\t'+'\"posY\": ' + doc.artLayers[i].bounds[1].toString().replace(" px", "")+',\n' ;
                // myExport += '\t\t\t'+'scaleX: ' + layerScaleW +'\",\n' ;
                // myExport += '\t\t\t'+'scaleY: ' + layerScaleH +'\",\n' ;
                myExport += '\t\t\t'+'\"width\": ' + layerWidth +',\n' ;
                myExport += '\t\t\t'+'\"height\": ' + layerHeight +',\n' ;
                myExport += '\t\t\t'+'\"typeElement\": ' + '\"' +  exportLayers.utils.checkTypeLayers(doc.artLayers[i].name) +'\",\n' ;
                myExport += '\t\t\t'+'\"imagePath\": ' + '\"' + "/" + folderExportName + "/" + exportLayers.utils.cleanName( doc.artLayers[i].name ) + ".png" + '\"\n' ;
                myExport += '\t\t'+' },\n';
                
            }
            myExport += '\t] \n';
            myExport += '\n}\n';
            myExport += 'export default Land;';
            
            //save
            exportLayers.utils.createFolderToExport('js');
            exportLayers.save(myExport, "/js/land.js");
    
        },
        
        CSS : function(){
            var exportCSS = '';
            //general
            exportCSS += '.map{ \n';
            exportCSS += '\tposition:absolute;\n';
            exportCSS += '\t/*overflow:hidden;*/\n';
            exportCSS += '\tbackground: white;\n';
            exportCSS += '\ttop:0 ; left: 0; right : 0; bottom: 0;\n';
            //fin de la map
            exportCSS += '}';

            exportCSS += '\n.map__content{ \n';
            exportCSS += '\twidth:'+  app.activeDocument.width.toString().replace(" px", "px") + ';\n';
            exportCSS += '\theight:'+  app.activeDocument.height.toString().replace(" px", "px") + ';\n';
            exportCSS += '\tposition:relative;\n';
            exportCSS += '\toverflow:hidden;\n';
            exportCSS += '\n';
            exportCSS += '}\n';

            //pour tous les éléments
            for(var i = 0; i < exportLayers.layersVisible.length; i++){
                var layerWidth = doc.artLayers[i].bounds[2].toString().replace(" px", "") - doc.artLayers[i].bounds[0].toString().replace(" px", "");
                var layerHeight = doc.artLayers[i].bounds[3].toString().replace(" px", "") - doc.artLayers[i].bounds[1].toString().replace(" px", "");
                var posX = doc.artLayers[i].bounds[0].toString().replace(" px", "px");
                var posY = doc.artLayers[i].bounds[1].toString().replace(" px", "px");
                
                exportCSS += '.map__content'+ ' .' + exportLayers.utils.cleanName( doc.artLayers[i].name ) + '{\n';
                exportCSS += '\tposition:absolute;\n';
                exportCSS += '\twidth:' +  layerWidth + 'px;\n';
                exportCSS += '\theight:' + layerHeight +'px;\n';
                exportCSS += '\tleft:' +  posX +';\n';
                exportCSS += '\ttop:' +  posY +';\n';
                exportCSS += '\tbackground:url(\"../'+ folderExportName + "/" + exportLayers.utils.cleanName( doc.artLayers[i].name ) + ".png" + '\") no-repeat;\n';
                exportCSS += '\tbackground-size:contain;\n';
                exportCSS += '}\n';
                
            }
  
            //
            exportLayers.utils.createFolderToExport('style');
            exportLayers.save(exportCSS, "/style/land.css");
        },

        SCSS : function(){
            var exportSCSS = '';
            //general
            exportSCSS += '.map{ \n';
            exportSCSS += '\tposition:absolute;\n';
            exportSCSS += '\t/*overflow:hidden;*/\n';
            exportSCSS += '\tbackground: white;\n';
            exportSCSS += '\ttop:0 ; left: 0; right : 0; bottom: 0;\n';
            //fin de la map
            exportSCSS += '}';

            exportSCSS += '\n.map__content{ \n';
            exportSCSS += '\twidth:'+  app.activeDocument.width.toString().replace(" px", "px") + ';\n';
            exportSCSS += '\theight:'+  app.activeDocument.height.toString().replace(" px", "px") + ';\n';
            exportSCSS += '\tposition:relative;\n';
            exportSCSS += '\toverflow:hidden;\n';
           
        
            //pour tous les éléments

            for(var i = 0; i < exportLayers.layersVisible.length; i++){
                var layerWidth = doc.artLayers[i].bounds[2].toString().replace(" px", "") - doc.artLayers[i].bounds[0].toString().replace(" px", "");
                var layerHeight = doc.artLayers[i].bounds[3].toString().replace(" px", "") - doc.artLayers[i].bounds[1].toString().replace(" px", "");
                var posX = doc.artLayers[i].bounds[0].toString().replace(" px", "px");
                var posY = doc.artLayers[i].bounds[1].toString().replace(" px", "px");
                
                exportSCSS += '\n';
                exportSCSS += '\t&.' + exportLayers.utils.cleanName( doc.artLayers[i].name ) + '{\n';

                exportSCSS += '\t\tposition:absolute;\n';
                exportSCSS += '\t\twidth:' +  layerWidth + 'px;\n';
                exportSCSS += '\t\theight:' + layerHeight +'px;\n';
                exportSCSS += '\t\tleft:' +  posX +';\n';
                exportSCSS += '\t\ttop:' +  posY +';\n';
                exportSCSS += '\t\tbackground:url(\"../'+ folderExportName + "/" + exportLayers.utils.cleanName( doc.artLayers[i].name ) + ".png" + '\") no-repeat;\n';
                exportSCSS += '\t\tbackground-size:contain;\n';
                exportSCSS += '\t}\n';
            }
            exportSCSS += '}\n\n';
            
            
            //
            exportLayers.utils.createFolderToExport('style');
            exportLayers.save(exportSCSS, "/style/land.scss");
        },
    
        HTML : function(){
            var exportHTML = '';
            exportHTML += '<!DOCTYPE html>\n';
            exportHTML += '<html>\n';
            exportHTML += '<head>\n';
            exportHTML += '<meta charset="utf-8">\n';
            exportHTML += '<title>'+ doc.name.toString().replace("psd","") +'</title>\n';
            exportHTML += '<meta name="viewport" content="width=device-width, initial-scale=1">\n';
            exportHTML += '<link rel="stylesheet" type="text/css" media="screen" href="./style/land.css">\n';
            exportHTML += '</head>\n';
            exportHTML += '<body>\n';
            exportHTML += '<div id="container">\n';

            //general
            exportHTML += '\t<div id="map"> \n';
            exportHTML += '\t\t<div id="map__content">\n';
            
            //generate <div> suivant layers
            for(var i = exportLayers.layersVisible.length - 1 ; 0 <= i ; i--){
                exportHTML += '\t\t\t<div class="'+exportLayers.utils.cleanName( doc.artLayers[i].name )+'"></div>\n';
            }
    
            //fin bloc html
            exportHTML += '\t\t</div> \n';
            exportHTML += '\t</div> \n';
            
            //fin HTML

            exportHTML += '</div>\n';
            exportHTML += '</body>\n';
            exportHTML += '</html>\n';


            //save
            exportLayers.save(exportHTML, "/map.html");;
        },



    },

    save : function(content, path){
        var fileOut = new File( docPath + path );
        fileOut.open("w","TEXT", "????");
        fileOut.write(content);
    },

    exportAllArtLayertoPNG : function(){     
        //create folder
        exportLayers.utils.createFolderToExport(folderExportName);
        
        //init deselect
        doc.selection.deselect();
        exportLayers.utils.hideAllLayers();
        for(var i = 0; i <  this.layersVisible.length; i++){
            // INIT : on cache tous les calques, 
            // doc.artLayers[i].visible = false;
          
            //on passe d'un calque à l'autre
            doc.activeLayer =  doc.artLayers[i];

            //rend visible le calque actif
            doc.activeLayer.visible = true;
            //on crop à la taille du calque actif
            app.activeDocument.crop( doc.activeLayer.bounds );
            //sauvegarde
            doc.saveAs( File( docPath + "/medias/" + this.utils.cleanName( doc.activeLayer.name ) + ".png" ) , new PNGSaveOptions(), true, Extension.LOWERCASE);
            
            //retour en arrière
            exportLayers.utils.stepHistoryBack();
            //
            doc.activeLayer.visible = false;
        }
        // i++;
        exportLayers.utils.showAllLayers();
    },

    utils : {
        
        checkVisibleLayers: function(){
            for(var i = 0; i < doc.layers.length; i++){
               if(doc.layers[i].visible){
                    exportLayers.layersVisible.push(doc.layers[i]) //pousse dans  la variable "layerVisible"
               }
            }
        },

        hideAllLayers: function(){
            //on cache tous les calques
            for(var i = 0; i < doc.layers.length; i++){
                    doc.layers[i].visible = false;
            }
        },

        showAllLayers: function(){
            //on affiches tous les claques visible avant le lancement du script
            for(var i = 0; i <  exportLayers.layersVisible.length; i++){
                exportLayers.layersVisible[i].visible = true;
            }
        },

        cleanName : function(name){
            name = name.replace(/\s+/gi, '-'); // remplace les espaces par des "-"
            name.replace(/[^a-zA-Z0-9\-]/gi, ''); // Enleve les characters spéciaux
            return name.toLowerCase() ; //met en minuscule les noms
        },
        
        //For the menu item 'Step Backward' ( the same as alt-ctrl-z ) use this  
        stepHistoryBack: function(){  
            var desc = new ActionDescriptor();  
                var ref = new ActionReference();  
                ref.putEnumerated( charIDToTypeID( "HstS" ), charIDToTypeID( "Ordn" ), charIDToTypeID( "Prvs" ));  
            desc.putReference(charIDToTypeID( "null" ), ref);  
            executeAction( charIDToTypeID( "slct" ), desc, DialogModes.NO );  
        }, 

        createFolderToExport: function(folderExportName){
            var f = new Folder(docPath + '/' + folderExportName +'/');  
            if (!f.exists) {  
                f.create();  
                // alert (f);  
            }  
        }, 

        checkTypeLayers: function(layerName){
            var type;
            if(layerName.match(/_clickable/)){
                return type = "clickable";
            }
            else if(layerName.match(/_video/)){
                return type = "video";
            }
            else if(layerName.match(/_anim/)){
                return type = "anime";
            }

            else if(layerName.match(/_item/)){
                return type = "item";
            }
            else{
                return type = "static"
            }
          
        },

        test: function(){
            for(var i=0; i < doc.layers.length; i++){
                if(doc.layers[i].name.match(/_anim/)){
                  doc.activeLayer.open()
                }
            }
        }

    }
}

exportLayers.init();
// exportLayers.utils.test();

