<h1 align="center">
  <br>
  Dramatify-pdf-reader
  <br>
</h1>

<h4 align="center">A simple application that converts your script to interactive components using <a href="https://www.python.org/" target="_blank">Python</a> and <a href="https://react.dev/" target="_blank">React</a>.</h4>

<p align="center">
  <a href="#key-features">Key Features</a> •
  <a href="#limitations">Limitations</a> •
  <a href="#how-to-use">How To Use</a> •
  <a href="#credits">Credits</a> •
  <a href="#description">Description</a> •
  <a href="#features">New Features</a> •
  <a href="#license">License</a>
</p>

<p align="center">
 <img src="pdf_converter.gif" />
</p>

## Key Features

- Supports PDF files
- Upload your own scripts
- Supports multiple scripts
- Search and isolate scenes
- Highlight selected actor lines
  - unique colors for easy actor identification
- Saves coverted scripts to localstorage

## Limitations

- Text in the PDF file is assumed to be formatted in a specific way.
- Look at the testfile.pdf in server/uploaded_files/ folder

## How To Use

To clone and run this application, you'll need [Git](https://git-scm.com), [Python](https://www.python.org/) and [Node.js](https://nodejs.org/en/download/) (which comes with [npm](http://npmjs.com)) installed on your computer. From your command line:

> **Note**
> For Windows only

```bash

# Clone this repository
$ git clone https://github.com/tomppatomppa/dramatify-pdf-reader.git

# Go into the repository
$ cd dramatify-pdf-reader

# Install client dependencies and create a build
# The script will automatically copy the build to server folder
# OR run $cd client && npm install && npm run start, to run the client seperately
$ cd client && npm install && npm run build-dev

# Go to server folder
$ cd ../server

# Create a virtual env and activate
$ python -m venv env && .\env\Scripts\activate

# Install Python dependecies
$ pip install -r requirements.txt

# Start the server
$ flask run
```

## Description

This app is designed to help actors easily identify their lines during long shooting days in the studio. With this app, actors can easily access their scripts, highlight their lines without needing to print out hundreds of pages and highlight them manually. Additionally, actors can isolate certain scenes by using the search bar or dropdown menu to filter their script and focus on specific sections. This app is a convenient and efficient tool for actors to prepare for their roles and make the most out of their time on set.

## Features to be implemented

- Adding additional text/notes to scenes
- Modifying existing text
- Adding more actors and lines
- Change the order of lines and scenes
- Change the order of scripts in the sidemenu
- Save to Cloud (Google Drive etc..)
- Custom scene and actor identification
- User can change font size
- User can change Text aligning
- User can change colors
- Select multiple scenes
- User can rehearse her/his own lines with google-text-to-speech

## Credits

This software uses the following open source packages:

- [Python](https://www.python.org/)
- [React](https://react.dev/)
- [Flask](https://flask.palletsprojects.com/en/2.2.x/)
- [PyMuPDF](https://pymupdf.readthedocs.io/en/latest/index.html)
- [React-Select](https://react-select.com/home)

## Live Website

[dramatify-web](https://dramatify.herokuapp.com/) - A Working Version Hosted On Heroku

## License

MIT

---

> GitHub [@tomppatomppa](https://github.com/tomppatomppa) &nbsp;&middot;&nbsp;
