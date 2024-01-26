export interface IEnvironment {
    production: boolean,
    imagesApiUri: string,
    foldersApiUri: string
}

export const environment: IEnvironment = {
    production: true,
    foldersApiUri: '',
    imagesApiUri: ''
};
