
export default function Paginator(props){
    const {totalPages,currentPage,setCurrentPage} = props

    const pages = []
    let previousPages = []
    let nextPages = []

                                         
    for(let i=currentPage-1  ;i>0;i--){
        if(i>0){    
            if(previousPages.length>=5){     
                previousPages = ['...'].concat(previousPages)           
                break;
            }        
            previousPages = [i].concat(previousPages)
        }

    }
    for(let i=currentPage;i<=totalPages;i++){
        if(i<=totalPages){
            if(nextPages.length>=5){
                nextPages.push("...")
                break;
            }
            nextPages  = nextPages.concat([i])        }
    }

    for(let i=1;i<=totalPages;i++){
        pages.push(i)
    }
    return(
        <div className='w-full h-[10vh] flex flex-col justify-center items-center'>
            <div className='w-[80%] h-[10vh] flex flex-col justify-center items-center'>
                <div className='w-full h-[10vh] flex flex-row justify-center items-center'>
                    {
                        previousPages.map((page,index)=>{
                            return(
                                <div key={index} onClick={()=>setCurrentPage(page)} className={`cursor-pointer h-[40px] flex justify-center items-center font-bold text-center w-[36px] mx-2 rounded-lg text-white border  ${currentPage===page?'selected-div':'w-[15px]'} `}>{previousPages[index]}</div>
                            )
                        })
                        

                    }
                   
                    {
                        nextPages.map((page,index)=>{
                            return(
                                <div key={index} onClick={()=>setCurrentPage(page)} className={`flex justify-center items-center text-center font-bold cursor-pointer h-[40px] w-[36px]  mx-2 rounded-lg text-white border  ${currentPage===page?'bg-theme':'w-[15px] '} `}>{nextPages[index]}</div>
                            )
                        }
                        )
                    }
                </div>
            </div>
        </div>
    )
}