function userProfile({params} : any) {
    return ( <>
    <h1>Hello Mr. {params.id}</h1>
    </> );
}

export default userProfile;