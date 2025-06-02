import * as React from 'react';
import * as XLSX from 'xlsx';
import { useState } from 'react';
import {Button, makeStyles, Spinner} from '@fluentui/react-components'
import { CheckmarkFilled } from "@fluentui/react-icons";

//interface avec les propriétés du btn
export interface IdownloadButtonProps {
  dataToExport: ComponentFramework.PropertyTypes.DataSet;
  filename: string | null;
  buttonText?: any;
  buttonHeight?: any;
  buttonWidth?: any;
}

//les étapes du btn pour le spinner
type LoadingState = "initial" | "loading" | "loaded";




export const downloadButton: React.FC<IdownloadButtonProps> = ({ dataToExport, filename, buttonText, buttonHeight, buttonWidth }) => {

    //les différentes variables pour le back du btn
    const [exportArray, setExportArray] = useState<any[]>([]);
    const [exportArrayReady, setExportArrayReady] = useState(false);
    const [requestExport, setRequestExport] = useState(false);
    const [pageNumber, setPageNumber] = useState(2);
    const [previousFirstRecord, setPreviousFirstRecord] = useState(String);
    const [loadingState, setLoadingState] = useState<LoadingState>("initial");
    var tempArray: any[] = [];


    //les différentes variables pour le visuel du btn
    const buttonContent = loadingState === "loading" ? "La patience est une vertu donc patiente" : buttonText;
    const buttonIcon = loadingState === "loading" ? ( <Spinner size='medium'/>) : loadingState === "loaded" ? ( <CheckmarkFilled />) : null;
    let useStyles = makeStyles({
      wrapper: {
        columnGap: "15px",
        display: "flex",
      },

      button: {
        minWidth: "100%",
        width:  buttonWidth + "px",
        height: buttonHeight + "px",
        position: 'relative',
        overflowX: 'auto',
        overflowY: 'auto',
        resize: 'none'
      },
    });





    //Exécution à chaque modification des variables dans le tableau à la fin
    React.useEffect(() => {

      //Si l'export n'est pas demandé on exécute rien
      if (requestExport){

          //Déterminer s'il reste des données à récupérer
          if(dataToExport.sortedRecordIds[0] != previousFirstRecord){ //Si les deux dernières pages retournés sont identiques il n'y a pas d'autres données à récupérer

            setPageNumber(pageNumber + 1);
            dataToExport.paging.loadExactPage(pageNumber); //la prochaine page n'est chargé qu'au prochain tour
            setPreviousFirstRecord(dataToExport.sortedRecordIds[0]);
            tempArray = exportArray;

            //boucle sur les lignes
            for(const recordId of dataToExport.sortedRecordIds){

              const record = dataToExport.records[recordId];
              const result : Record<string, any> = {};

              //boucle sur les colonnes 
              for (const column of dataToExport.columns){
                  result[column.name] = record.getValue(column.name);
              }

              //remplir le tableau
              tempArray.push(result);
              setExportArray(tempArray);
              
            }

          }else{
            //si il n'y a pas d'autres données à récupérer l'export est prêt
            setExportArrayReady(true);
          }

          

          //si le tableau d'export est rempli
          if(exportArrayReady){
            //remplir et télécharger le fichier excel
            const dataWorksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportArray);
            const workbook: XLSX.WorkBook = {Sheets: {'data': dataWorksheet}, SheetNames: ['data']}
            XLSX.writeFile(workbook, filename + '.xlsx');

            //remise à zéro de toutes les variables nécessaires
            tempArray = []
            setRequestExport(false);
            setExportArrayReady(false);
            setExportArray([]);
            setPreviousFirstRecord("");
            setPageNumber(2);
            dataToExport.paging.reset();
            setLoadingState("loaded")
          }
        
      }


    }, 
    [dataToExport, requestExport, exportArrayReady]); //Si ces variables sont modifié le code dans useEffect est lancé




    //fonction exécuté quand le btn est cliqué
    function onButtonClick(){
      setLoadingState("loading")
      setRequestExport(true);
    }


  

    //btn retourné par ce fichier
    return (
        <Button className={useStyles().button} appearance='primary' icon={buttonIcon} disabledFocusable={loadingState === "loading"} onClick={onButtonClick}> 
          {buttonContent}
        </Button>
    );

}