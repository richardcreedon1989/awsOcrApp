import React, { Component } from 'react';
import FileBase64 from 'react-file-base64';
import { Form, Button, FormGroup, Label, FormText, Input } from "reactstrap"
import "./upload.css"
import axios from "axios";

class Upload extends Component {

    constructor(props) {
        super(props)

        this.state = {
            confirmation: "",
            isLoading: "",
            files: "",
            ppsn: "",
            lambdaReturn: "",
            lastName: "",
            firstName: "",
            ppsnPresent: false,
            lastNamePresent: false,
            firstNamePresent: false
        };
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange = (e) => {
        e.preventDefault();
        const value = e.target.value;
        const name = e.target.name
        this.setState({ [name]: value })
    }


    // async handleSubmit(e) {
    //     e.preventDefault();
    //     // }


    async getFiles(files) {
        const { ppsn, lambdaReturn, firstName, lastName } = this.state
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

        const targetImage = UID + "png";
        var self = this
        axios("https://6velcmlhx7.execute-api.us-east-1.amazonaws.com/Production/ocr", {

            method: "POST",
            data,

        })
            .then(response => {
                console.log("OCR", response)
                this.setState({ lambdaReturn: response.data.body[0] })

                console.log("responseData", response.data.body)
                console.log("lambdaState", lambdaReturn)




                // this.setState({ ppsnPresent: response.data.body[1] })
                // this.setState({ firstNamePresent: response.data.body[2] })
                // this.setState({ lastNamePresent: response.data.body[3] })
            })

            .catch(error => {
                console.log(error)
                alert("Please refresh the browser and try again")
            });


        // console.log(ppsn)
        // console.log(firstName)
        // console.log(lastName)
        console.log("lambdaState", lambdaReturn)

        // let pattern1 = new RegExp(ppsn)
        // let checkPatternLambda1 = pattern1.test(lambdaReturn)

        // // let regtest = /([0-9]{6,7})?[A-Za-z]{1}/
        // // let regtest1 = regtest.test(lambdaReturn)
        // // console.log("regtest", regtest1)
        // if (checkPatternLambda1 === true && ppsn !== "") {
        //     this.setState({ ppsnPresent: true })
        // }

        // let pattern2 = new RegExp(lastName)
        // let checkPatternLambda2 = pattern2.test(lambdaReturn)
        // if (checkPatternLambda2 && lastName !== "") {
        //     this.setState({ lastNamePresent: true })
        // }

        // let pattern3 = new RegExp(firstName)
        // let checkPatternLambda3 = pattern3.test(lambdaReturn)
        // if (checkPatternLambda3 && firstName !== "") {
        //     this.setState({ firstNamePresent: true })
        // }
    }

    render() {

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
                                        onChange={this.handleChange}
                                        pattern="[0-9]{7}[A-Za-z]{1}"
                                        title="Required: 7 digits followed by a letter (1234567P)"
                                    />
                                    <h6> PPSN PRESENT . . .  </h6>
                                    <Label check>
                                        <input
                                            type="checkbox"
                                            checked={this.state.ppsnPresent}
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
                                        onChange={this.handleChange}


                                    />
                                    <h6> LAST NAME PRESENT . . .  </h6>
                                    <Label check>
                                        <input
                                            type="checkbox"
                                            checked={this.state.lastNamePresent}
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
                                        onChange={this.handleChange}

                                    />
                                    <h6> FIRST NAME PRESENT . . .  </h6>
                                    <Label check>
                                        <input
                                            type="checkbox"
                                            checked={this.state.firstNamePresent}
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