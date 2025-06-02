import { IInputs, IOutputs } from "./generated/ManifestTypes";
import { downloadButton, IdownloadButtonProps } from "./downloadButton";
import * as React from "react";

export class btnDataverseTableDownload implements ComponentFramework.ReactControl<IInputs, IOutputs> {

//déclaration de variables privés
    private notifyOutputChanged: () => void;

//constructeur vide
    constructor() {}




//préparation du contexte pour l'exécution du bouton 
    public init(
        context: ComponentFramework.Context<IInputs>,
        notifyOutputChanged: () => void,
    ): void {
        this.notifyOutputChanged = notifyOutputChanged;
        context.mode.trackContainerResize(true)
        context.parameters.dataToExport.paging.setPageSize(2000)
    }





//exécution à chaque modification
    public updateView(context: ComponentFramework.Context<IInputs>): React.ReactElement {

    //Interface avec les propriétés nécessaire au btn
        const props: IdownloadButtonProps = { 
            dataToExport: context.parameters.dataToExport,
            filename: context.parameters.filename.raw,
            buttonText: context.parameters.buttonText.raw,
            buttonHeight: context.mode.allocatedHeight,
            buttonWidth: context.mode.allocatedWidth,
        };

    //retourner le bouton en lui passant les propriétés
        return React.createElement(
        downloadButton, props
        );
    }





//rien à retourner
    public getOutputs(): IOutputs {
        return {};
    }

//rien à détruire
    public destroy(): void {

    }
}
