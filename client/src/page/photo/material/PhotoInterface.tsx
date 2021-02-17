export interface IPhotoInfo{

    authorKey?: number,
    authorName?: string,
    createDate?: string,
    description?: string,
    new?: number[],
    photoName?: string,
    photoPath?: string,
    photoType?: number,
    tagList?: string[],
    title?: string[],
    __v?: number,
    _id?: string,

}


export interface ICommentList{
    authorKey: number,
    authorName: string,
    commentTxt?: string,
    createDate: string,
    personalImgName?: string,
    personalImgPath?: string,
    photoId: string,
    __v: number,
    _id: string,
}

export interface IPhoto{
    id:string,
    name:string,
    path:string,
    type:number,
    _id:string,
}

export interface IAuthorInfo{
    authorName: string,
    key?: number,
    personalImgName?: string,
    personalImgPath?: string,
    photo: IPhoto[],
}

export interface IAuthorImgListProps{
    authorName?: string,
    _key?: number,
    personalImgPath?: string,
    photo?: IPhoto[],
}

