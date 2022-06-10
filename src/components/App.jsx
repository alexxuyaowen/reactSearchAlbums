import React, { Component } from "react";

class App extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            userInput: "",
            limit: 5,
            resultInfo: "Search Albums by ArtistName: ",
            albumsArr: new Array(),
        }
    }

    _fetchAPI() {
        this._isLoading(true);

        fetch(`https://itunes.apple.com/search?term=${this.state.userInput}&media=music&entity=album&attribute=artistTerm&limit=200`)
            .then(res => res.json())
            .then(data => {
                this._isLoading(false);
                this.setState({albumsArr: [...data.results]});
            })
            
            setTimeout(()=>this.setState({
                limit: Math.min(this.state.limit, this.state.albumsArr.length),
                resultInfo: `${this.state.limit}/${this.state.albumsArr.length} results for "${this.state.userInput}"`
            }), 100);
    }

    _isLoading(state) {
        const resultInfo = document.getElementById("result-info");
        const loader = document.querySelector('.loader');
        const loadMore = document.getElementById("loadMore");

        if (state) {
            resultInfo.style.display = "none";
            loader.style.display = "inline";
            document.body.style.cursor = "wait";
            loadMore.style.display = "none";
        } else {
            resultInfo.style.display = "inline";
            loader.style.display = "none";
            document.body.style.cursor = "default";
            loadMore.style.display = "block";
        }
    }

    _widen() {
        document.querySelector(".search-bar").style.width = "50%";
    }

    _albumHTML(e, id) {
        return <div className="album">
                  <img onClick={()=>this._detail(id)} src={e.artworkUrl100} className="cover-pic" />
                  <p onClick={()=>this._detail(id)} className="collection-name">{e.collectionName.length > 42 ? e.collectionName.substring(0, 42) + "..." : e.collectionName}</p>
                </div>
    }

    _detail(i) {
        // filter out the "?uo=4" at the end of the link, which causes problems
        window.open(this.state.albumsArr[i].collectionViewUrl.slice(0, -5), "_blank").focus();
    }

    render() {
        return <div>
            <div className="nav-bar">
                <form className="search-bar">
                    <input type="text" id="user-input" onChange={e => this.setState({ userInput: e.target.value })}
                        onKeyPress={e => {if (e.key === "Enter") {this._fetchAPI(); e.target.value=""}}}
                        onFocus={this._widen} name="search" placeholder="Search..." autoComplete="off" required />
                    <input type="submit" id="submitBtn" value="🔍" onClick={e => { this._fetchAPI(); e.preventDefault(); e.target.value=""}} />
                </form>
            </div>

            <div className="content-box">
                <header id="result-info">{this.state.resultInfo}</header>
                <img src="https://i.gifer.com/ZKZx.gif" className="loader" />
                <hr />

                <ul id="albums">
                    {this.state.albumsArr.slice(0, this.state.limit).map((e, id) => this._albumHTML(e, id))}
                </ul>
            </div>

            <button id="loadMore" onClick={() => {
                const resultCount = this.state.albumsArr.length;
                this.setState({
                    limit: Math.min(resultCount, this.state.limit + 5),
                    resultInfo: `${this.state.limit+5}/${this.state.albumsArr.length} results for "${this.state.userInput}"`
                });
                document.getElementById("loadMore").style.display = this.state.limit >= resultCount ? "none" : "block";
            }
            }>+</button>
        </div>
    }
}

export default App;