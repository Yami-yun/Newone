export const canvasW = 800;
export const canvasH = 520;

// canvas y 좌표를 xy 좌표상으로 바꾼다.
function remakeY(y:number):number{
    return canvasH-y;
}

interface IRect{
    ctx:CanvasRenderingContext2D;
    x: number;
    y: number;
    w: number;
    h: number;
    c?:string;
};

interface ILine{
    ctx:CanvasRenderingContext2D;
    x: number;
    y: number;
    endX: number;
    endY: number;
    c?:string;
};

interface IText{
    ctx:CanvasRenderingContext2D;
    x: number;
    y: number;
    text: string;
    c?:string;
    size?: number;
};

interface IGetBarW{
    offset: {x: number, y:number};          // 막대 그래프 offset
    barGapW: number;                        // 막대 사이 간격
    xDataLen: number;                       // 막대 갯수
}

// 직사각형을 칸바스에 그린다.
export function Rect({ctx, x, y, w, h, c=""}:IRect):void{
    if(c){
        ctx.fillStyle = c;
    }
    console.log(remakeY(y));
    ctx.fillRect(x, remakeY(y), w, (-1) * h);
}

// 선을 칸바스에 그린다.
export function Line({ctx, x, y, endX, endY, c=""}:ILine):void{
    if(c){
    ctx.strokeStyle = c;
    }
    ctx.beginPath();
    ctx.moveTo(x, remakeY(y));
    ctx.lineTo(endX, remakeY(endY) );
    ctx.stroke()
}

// 칸바스에 텍스트를 그린다.
export function Text({ctx, x, y, text, c="black", size=11}:IText):void{

    ctx.fillStyle = c;
    ctx.font = `700 ${size}px Arial`;
    ctx.fillText(text, x, remakeY(y)); 
}

// offset : 그래프 offsest, barGapW : 막대 사이 간격, xDataLen : 그래프 막대 갯수 
export function GetBarW({offset, barGapW, xDataLen}:IGetBarW):number{
    return (canvasW - offset.x * 2 - barGapW * (xDataLen - 1) ) / xDataLen;;
}