import React, { Component } from 'react';
import FileBase64 from 'react-file-base64';
import { Form, FormGroup, Label, FormText, Input } from "reactstrap"
import "./upload.css"
import axios from "axios";

class Upload extends Component {

    constructor(props) {
        super(props)

        this.state = {
            // confirmation: "",
            // isLoading: "",
            files: "",
            ppsn: "",
            lambdaReturn: "",
            lastName: "",
            firstName: "",
            ppsnPresent: false,
            lastNamePresent: false,
            firstNamePresent: false,
            // focus: false,
            // error: false,
            disabled: true
        };
        this.handleChange = this.handleChange.bind(this);
        this._onKeyUp = this._onKeyUp.bind(this)
    }

    handleChange = (e) => {
        e.preventDefault();
        const value = e.target.value;
        const name = e.target.name
        this.setState({ [name]: value })
    }
    _onKeyUp() {

        setTimeout(() => {
            let regex = /[0-9]{7}[A-Za-z]{1}/g;

            if (this.state.ppsn.match(regex)) {
                this.setState({ disabled: false })

            }
        }, 0)
    }

    async getFiles(files) {
        const { ppsn, firstName, lastName } = this.state
        this.setState({
            isLoading: "Extracting Data",
            files: files
        })

        const UID = Math.round(1 + Math.random() * (1000000 - 1));

        var data = {
            fileExt: "png",
            imageID: UID,
            folder: UID,
            ppsn,
            firstName,
            lastName,
            img: this.state.files.base64
        };


        await axios("https://6velcmlhx7.execute-api.us-east-1.amazonaws.com/Production", {
            method: "POST",
            data
        })
            .then(response => {
                console.log("s3", response)
            })
            .catch(error => {
                console.log(error)
            });

        axios("https://6velcmlhx7.execute-api.us-east-1.amazonaws.com/Production/ocr", {

            method: "POST",
            data,

        })
            .then(response => {
                console.log("OCR", response)
                this.setState({ lambdaReturn: response.data.body[0] })

                if (ppsn !== "") {
                    this.setState({ ppsnPresent: response.data.body[1] })
                }

                if (firstName !== "") {
                    this.setState({ firstNamePresent: response.data.body[2] })
                }

                if (lastName !== "") {
                    this.setState({ lastNamePresent: response.data.body[3] })
                }
            })

            .catch(error => {
                console.log(error)
                alert("Please refresh the browser and try again")
            });

    }

    render() {
        const { ppsnPresent, lastNamePresent, firstNamePresent } = this.state
        const processing = "Processing document . . .";
        return (
            <div className="container">
                <div >
                    <div >
                        <Form >

                            <FormGroup>
                                <Label>
                                    <h6> PPSN</h6>
                                    <Input
                                        type="text"
                                        name="ppsn"
                                        id="ppsn"
                                        placeholder="(e.g. 1234567P)"
                                        onChange={this.handleChange}
                                        onKeyUp={this._onKeyUp}


                                    />
                                    <h6> PPSN PRESENT . . .  </h6>
                                    <Label check>
                                        <input
                                            type="checkbox"
                                            checked={ppsnPresent}
                                            onChange={this.handleChange}
                                        />

                                    </Label>

                                </Label>

                            </FormGroup>

                            <FormGroup>
                                <Label>
                                    <h6> LAST NAME</h6>
                                    <Input
                                        type="text"
                                        name="lastName"
                                        id="lastName"
                                        placeholder="(Bloggs)"
                                        onChange={this.handleChange}
                                        disabled={this.state.disabled}


                                    />
                                    <h6> LAST NAME PRESENT . . .  </h6>
                                    <Label check>
                                        <input
                                            type="checkbox"
                                            checked={lastNamePresent}
                                            onChange={this.handleChange}
                                        />

                                    </Label>

                                </Label>

                            </FormGroup>

                            <FormGroup>
                                <Label>
                                    <h6> FIRST NAME </h6>
                                    <Input
                                        type="text"
                                        name="firstName"
                                        id="firstName"
                                        placeholder="(Joe)"
                                        onChange={this.handleChange}
                                        disabled={this.state.disabled}

                                    />
                                    <h6> FIRST NAME PRESENT . . .  </h6>
                                    <Label check>
                                        <input
                                            type="checkbox"
                                            checked={firstNamePresent}
                                            onChange={this.handleChange}
                                        />

                                    </Label>

                                </Label>



                            </FormGroup>

                            <FormGroup>
                                <h3 className="text-danger"> </h3>
                                <h6> Upload Invoice </h6>
                                <FormText color="muted"> PNG, JPG </FormText>


                                <div className="form-group files color">

                                    <FileBase64 mulitple={true}
                                        onDone={this.getFiles.bind(this)}> </FileBase64>

                                </div>
                            </FormGroup>


                            {/* <Button className="btn btn-lg btn-block btn-success">
                                Submit
                                </Button> */}
                        </Form>

                    </div>
                </div >
            </div >
        );
    }
}

export default Upload;