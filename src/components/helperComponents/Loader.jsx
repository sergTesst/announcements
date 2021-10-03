
export const  Loader =  (props)=> {
	const {dim} = props;
	return(
		<div className="loader">
			<div className="d-flex justify-content-center">
				<img  className="img img-fluid"
					style={{
						width: dim? `${dim}px`:`150px`,
						height:dim? `${dim}px`: `150px`
					}} 
					src="/assets/img/loader.gif"
					alt='img loader'
					/>
			</div>
		</div>
	)
}