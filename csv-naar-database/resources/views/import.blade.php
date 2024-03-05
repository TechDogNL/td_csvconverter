<h1>Import File</h1>
<form action="export" method="POST" enctype="multipart/form-data">
    @csrf
    <input type="file" name="file" id="uploadFile"  multiple accept=".csv"> <br> <br>
    <button type="submit" onclick="checkFile()">Import CSV</button>
</form>
<script>
 function checkFile() { 
        var fileInput = document.getElementById("uploadFile");
        
        if (fileInput.files.length === 0) {
            alert("No files selected");
            return false;
        } else {
            return true;
        }
    
}


</script>
