<h1>Import File</h1>
<form action="Import" method="POST" enctype="multipart/form-data">
    @csrf
    <input type="file" name="file" multiple"> <br> <br>
    <button type="submit">Import CSV</button>
</form>
