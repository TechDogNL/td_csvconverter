<h1>Import File</h1>
<form action="import" method="POST" enctype="multipart/form-data">
    @csrf
    <input type="file" name="file" multiple accept=".csv"> <br> <br>
    <button type="submit">Import CSV</button>
</form>
