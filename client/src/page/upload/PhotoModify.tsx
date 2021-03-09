import React, { useState, useCallback, useEffect } from 'react';
import GlobalStyle from 'globalStyles';
import Header from 'component/Header';
import { InputBox, InputParagraphBox, WhiteInputLabel } from 'component/input';
import { BlueBtn, WhiteBtn } from 'component/button';
import { tmpPhotoDelete, tmpPhotoUpload, getPhotoInfo, modifyPhoto } from 'redux/actions/photoAction';
import { useDropzone } from 'react-dropzone';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { SERVER_PATH } from 'config/path';
import Footer from 'component/Footer';
import { 
    TopLayout, 
    BottomLayout, 
    PageLayout, 
    ImgDropDownBox, 
    UploadImg, 
    InputTxt, 
    TagList, 
    TagBox, 
    PhotoTypeList, 
    initUploadForm, 
    UploadFormType, 
    initPhotoForm, 
    PhotoFormType  
} from './component/UploadUI';

// 작품 변경 페이지 컴포넌트
function PhotoModify(){
    const [uploadForm, setUploadForm] = useState<UploadFormType>(initUploadForm);       // 서버로 보낼 업로드 폼
    const [photoForm, setPhotoForm] = useState<PhotoFormType>(initPhotoForm);           // 이미지 드롭존으로 받은 이미지 정보

    const [isPhotoChange, setIsPhotoChange] = useState<boolean>(false);                 // 작품 사진 변경 여부 상태 변수
    const disPatch = useDispatch();
    const history = useHistory();

    // 사용자의 데이터를 가져온다.
    const userData = useSelector((state:any) => state.user.auth);
    const photoData = useSelector((state:any) => state.photo.modifyPhoto);

    useEffect(() => {
        // 수정할 photo info를 가져옴
        getPhotoInfo({photoId:photoData?.id}).then(
            response => {
                const photoInfo = response.payload;
                const result = photoInfo.result;

                if(photoInfo.success){
                    setUploadForm({ ...uploadForm, 
                        title: result.title,
                        tagList: result.tagList,
                        description: result.description,
                        photoType: result.photoType,
                    });
                    setPhotoForm({...photoForm,
                            photoPath: result.photoPath,
                            photoName: result.photoName,
                        });
                }
                disPatch(response);
            })
    }, []);

    // 이미지 드롭박스 구간에서 이미지를 드롭하거나 이미지를 선택했을 때
    const onDrop = useCallback(acceptedFiles => {

        // 다중 파일 업로드를 위한 폼 데이터
        const formData = new FormData();
        const config = {
            headers: { 'Content-type': 'multipart/form-data' }
        };
        formData.append("file", acceptedFiles[0]);
        
        // 파일 확장자를 통해, 불러온 파일이 이미지 파일인지 여부를 확인한다.
        const ext = acceptedFiles[0].name.split('.')[acceptedFiles[0].name.split('.').length - 1];
        if(["jpg", "png", "jpeg", "svg"].includes(ext)){

            const body = {photoName:photoForm.photoName, photoPath:photoForm.photoPath};
            tmpPhotoDelete(body)
            .then(response=>{
                //서버로 이미지 임시 저장
                tmpPhotoUpload({formData, config}).then(
                    response => {
                        console.log(response);
                        if(response?.payload?.success){
                            setPhotoForm({ ...uploadForm,
                                photoPath: response.payload.filePath,
                                photoName: response.payload.fileName,
                            });
                            setIsPhotoChange(true);
                        }
                    });
            });
        }
        else{
            // 이미지 파일이 아닐 경우.
            return alert("이미지 파일을 선택해주세요.");
        }
    }, []);

    const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop});

    // set image title
    const onTitleHandler = (e:React.ChangeEvent<HTMLInputElement>) => { setUploadForm({...uploadForm, title : e.target.value}); };

    // set image description
    const onDescriptionHandler = (e:React.ChangeEvent<HTMLTextAreaElement>) => { setUploadForm({...uploadForm, description : e.target.value}); };

    // set image tag
    const onTagHandler = (e:React.ChangeEvent<HTMLInputElement>) => { setUploadForm({...uploadForm, tag : e.target.value}); };

    // image 태그 추가 핸들러
    const addTagHandler = (e:any) => {
        // enter 입력시 태그 등록
        if(e.key === "Enter"){
            e.preventDefault();
            if(uploadForm.tag === "") return alert("태그를 입력해주세요");
            setUploadForm({...uploadForm, tag: "", tagList : [...uploadForm.tagList, e.target.value] });
        }
    };

    // set image type
    const onPhotoTypeHandler = (e:React.MouseEvent<HTMLButtonElement, MouseEvent>, _type: number) =>{
        e.preventDefault();
        setUploadForm({...uploadForm, photoType: _type });
    };

    // 서버로 이미지 폼 전송
    const onPhotoSubmit = (e:any) => {
        e.preventDefault();
        // 폼 미작성 부분 확인
        if(uploadForm.title === "") return alert("타이틀을 입력해주세요");
        if(photoForm.photoName === "") return alert("이미지를 넣어주세요.");
        if(uploadForm.photoType === 4) return alert("포토 타입을 클릭해서 정해주세요.");

        const body = {
            data:{
                title : uploadForm.title,
                description : uploadForm.description,
                tagList : uploadForm.tagList,
                photoName : photoForm.photoName,
                photoPath : photoForm.photoPath,
                photoType : uploadForm.photoType,
            },
            isPhotoChange,
        };
        
        modifyPhoto(body).then(
            response => {
                if(response.payload.success){
                    // 서버로 전송 성공 시, 개인 페이지로 이동
                    history.push(`/personal/${userData.key}`);
                } else {
                    alert("DB 저장에 실패했습니다.")
                }
                disPatch(response);
            }
        );

    };

    return (
    <>
        <GlobalStyle />

        <TopLayout>
            <Header userData={userData}/>
        </TopLayout>

        {/* 여기서부터 해당 페이지 내용 */}
        <BottomLayout>
            <PageLayout>
                {/* 이미지 가져오는 부분 */}
                <ImgDropDownBox {...getRootProps()} style={{  }}>
                    <input {...getInputProps()} />
                    {photoForm.photoPath !== "" ? <UploadImg
                                src={`${SERVER_PATH}${photoForm.photoPath}` }/> : <p style={{zIndex: 3}}> 클릭하거나 이미지를 끌어와 주세요 </p>}
                </ImgDropDownBox>
                
                {/* 이미지 등록 양식 란 */}
                <form onSubmit={onPhotoSubmit} style={{ display:'flex', flexDirection: 'column' }}>
                    <WhiteInputLabel>Title</WhiteInputLabel>
                    <InputBox style={{ width: "100%"}} placeholder="작품의 제목을 입력해주세요." value={uploadForm.title} onChange={onTitleHandler}/>
                    <WhiteInputLabel>Description</WhiteInputLabel>
                    <InputParagraphBox style={{ width:"95%" }} placeholder="작품을 간단히 설명해주세요." value={uploadForm.description} onChange={onDescriptionHandler}/>
                    <WhiteInputLabel>Tag</WhiteInputLabel>
                    <TagList>
                        <InputBox 
                        value={uploadForm.tag} 
                        onChange={onTagHandler} 
                        style={{ marginBottom: 0, width: 120, display:"flex", justifyContent:"center"}} 
                        placeholder="# 태그 입력" 
                        onKeyPress={addTagHandler}/>
                        {
                            uploadForm.tagList.map( (tag, index)=> (<TagBox key={index}>{`# ${tag}`}</TagBox>) )
                        }
                    </TagList>

                    <InputTxt>PHOTO TYPE</InputTxt>
                    <PhotoTypeList>
                        <WhiteBtn isClicked={uploadForm.photoType===0} onClick={(e)=>{onPhotoTypeHandler(e, 0);}}>일러스트</WhiteBtn>
                        <WhiteBtn isClicked={uploadForm.photoType===1} onClick={(e)=>{onPhotoTypeHandler(e, 1);}}>만화</WhiteBtn>
                        <WhiteBtn isClicked={uploadForm.photoType===2} onClick={(e)=>{onPhotoTypeHandler(e, 2);}}>캘리그라피</WhiteBtn>
                    </PhotoTypeList>
                    
                    <BlueBtn type="submit" style={{ marginTop: 54, width: "100%"}}>작품 등록</BlueBtn>
                </form>
            </PageLayout>
        </BottomLayout>
        <Footer />
    </>);
}
export default PhotoModify;