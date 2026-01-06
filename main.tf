provider "aws" {
  region = "ap-south-1"
}

resource "aws_instance" "matchmyresume_server" {
  ami           = "ami-02b8269d5e85954ef"
  instance_type = "t2.micro"
  key_name      = "devops-key"

  tags = {
    Name = "MatchMyResume-Server"
  }

  user_data = <<-EOF
              #!/bin/bash
              apt update -y
              apt install -y nginx
              systemctl enable nginx
              systemctl start nginx
              EOF
}

output "instance_ip" {
  value = aws_instance.matchmyresume_server.public_ip
}
