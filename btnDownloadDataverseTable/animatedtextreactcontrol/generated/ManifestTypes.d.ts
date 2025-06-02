/*
*This is auto generated from the ControlManifest.Input.xml file
*/

// Define IInputs and IOutputs Type. They should match with ControlManifest.
export interface IInputs {
    buttonText: ComponentFramework.PropertyTypes.StringProperty;
    filename: ComponentFramework.PropertyTypes.StringProperty;
    buttonHeight: ComponentFramework.PropertyTypes.StringProperty;
    dataToExport: ComponentFramework.PropertyTypes.DataSet;
}
export interface IOutputs {
    filename?: string;
}
