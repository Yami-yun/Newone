export interface IUpperImgProps{
    upperImgName?:string,
    upperImgPath?:string,
};

export interface IPersonalInfoProps{
    key:number,
    personalImgName?:string,
    personalImgPath?:string,
    authorName?:string,
    homepage?:string,
    twitter?:string,
    instruction?:string,
    isUser:boolean,
    follower:number[],
    follow:number[],
    photo:{
        id:string,
        name:string,
        path:string,
        type:number,
        _id:string,
    }[],
};

export interface IBottomingListProps{
    isUser?:boolean,
    photo?:{
        id:string,
        name:string,
        path:string,
        type:number,
        _id:string,
    }[],
};