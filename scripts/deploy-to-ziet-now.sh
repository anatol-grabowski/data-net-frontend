build_dir=$1
deploy_name=$2
echo "deploying $build_dir on ziet-now under alias $deploy_name"
deploy_url=$(now deploy --confirm --name $deploy_name $build_dir | grep $deploy_name)
now alias $deploy_url $deploy_name
