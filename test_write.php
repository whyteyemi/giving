<?php
$target_dir = "uploads/";
if (!file_exists($target_dir)) {
    if (mkdir($target_dir, 0777, true)) {
        echo "Created directory\n";
    } else {
        echo "Failed to create directory\n";
    }
} else {
    echo "Directory exists\n";
}

$test_file = $target_dir . "test.txt";
if (file_put_contents($test_file, "test")) {
    echo "Successfully wrote to file: $test_file\n";
    unlink($test_file);
} else {
    echo "Failed to write to file: $test_file\n";
}
?>
